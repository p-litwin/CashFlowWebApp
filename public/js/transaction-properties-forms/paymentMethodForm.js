const METHOD_EDIT_FORM_ID = "#method-edit-form";
const METHOD_EDIT_ID = "#method-edit-id";
const METHOD_EDIT_NAME_ID = "#method-edit-name";
const METHOD_DELETE_FORM_ID = "#method-delete-form";
const METHOD_DELETE_ID = "#method-delete-id";

const PAYMENT_METHOD_VALIDATION_RULES = {
    required: true,
    maxlength: 50,
    remote: {
        url: '/payment-methods/validate',
        data: {
            name: function () {
                return $(`${METHOD_EDIT_NAME_ID}`).val();
            },
            ignore_id: function () {
                return $(`${METHOD_EDIT_ID}`).val();
            }
        }
    },
    messages: {
        remote: 'Metoda płatności już istnieje w bazie'
    }
};

// Turn on the validation for payment method forms

$(document).ready(function () {
    $(`${METHOD_EDIT_FORM_ID}`).validate(COMMON_VALIDATION_PARAMETERS);
    $(`${METHOD_EDIT_NAME_ID}`).rules("add", PAYMENT_METHOD_VALIDATION_RULES);
});

// Event listeners for payment methods forms

const paymentMethodEditModal = document.getElementById('method-edit-modal')
if (paymentMethodEditModal) {
    paymentMethodEditModal.addEventListener('show.bs.modal', updatePaymentMethodEditModalOnLoad);
    paymentMethodEditModal.addEventListener('shown.bs.modal', () => {
        paymentMethodEditModal.querySelector(`${METHOD_EDIT_NAME_ID}`).focus();
    });
};

const methodDeleteModal = document.getElementById('method-delete-modal')
if (methodDeleteModal) {
    methodDeleteModal.addEventListener('show.bs.modal', updatePaymentMethodDeleteModalOnLoad);
};

const nameInput = document.querySelector(`${METHOD_EDIT_NAME_ID}`);
if (nameInput) {
    nameInput.addEventListener('keydown', preventDefaultEnterKeyBehoviour);
    nameInput.addEventListener('input', checkForSimilarItemsOnInput);
}

const submitButton = document.querySelector(`${METHOD_EDIT_FORM_ID} > button[type='submit']`);
if (submitButton) {
    submitButton.addEventListener('click', checkForSimilarItemsOnSubmit);
};


/**
 * Checks for similar items on method names input.
 * 
 * @param {Event} event - The input event.
 * @returns {Promise<void>} - A promise that resolves when the check is complete.
 */
async function checkForSimilarItemsOnInput(event) {
    
    const form = document.querySelector(`${METHOD_EDIT_FORM_ID}`);
    const methodName = document.querySelector(`${METHOD_EDIT_NAME_ID}`).value;
    const methodId = document.querySelector(`${METHOD_EDIT_ID}`).value;
    const similarMethodsList = new similarItemsDialog();

    if (methodName != "") {

        similarMethodsList.setConfirmationCheckboxValue(false);
        const similarMethods = await getSimilarMethods(methodName, methodId);

        if (similarMethods.length > 0) {
            
            similarMethodsList.udpateAndDisplayList(similarMethods);
            form.disableSubmitButton();
            delete similarMethodsList;
            return;

        }
    }

    similarMethodsList.hide();
    delete similarMethodsList;
    form.enableSubmitButton();

}

/**
 * Checks for similar items on form submission.
 * @param {Event} event - The form submission event.
 * @returns {Promise<void>} - A promise that resolves when the check is complete.
 */
async function checkForSimilarItemsOnSubmit(event) {
    
    const form = document.querySelector(`${METHOD_EDIT_FORM_ID}`);
    const methodName = document.querySelector(`${METHOD_EDIT_NAME_ID}`).value;
    const methodId = document.querySelector(`${METHOD_EDIT_ID}`).value;
    const similarMethodsList = new similarItemsDialog();

    if (methodName != "") {

        if (!similarMethodsList.isConfirmationCheckboxChecked()) {
            
            event.preventDefault();
            const similarMethods = await getSimilarMethods(methodName, methodId);

            if (similarMethods.length > 0) {
                similarMethodsList.udpateAndDisplayList(similarMethods);
                form.disableSubmitButton();
                delete similarMethodsList;
                return;

            }
            
        } else {

            const isFormInvalid = $(`${METHOD_EDIT_FORM_ID}`).validate().invalid;
            isFormInvalid.name === false ? form.submit() : null;

        }
    }

    similarMethodsList.hide();
    delete similarMethodsList;
    form.enableSubmitButton();

}

/**
 * Handles the event when the payment method edit modal is shown.
 * 
 * @param {Event} event - The event object.
 */
function updatePaymentMethodEditModalOnLoad(event) {
    const modalTitle = paymentMethodEditModal.querySelector('.modal-title');
    const form = paymentMethodEditModal.querySelector(`${METHOD_EDIT_FORM_ID}`);
    const button = event.relatedTarget;
    const action = button.getAttribute('data-action');
    const similarMethodsDialog = new similarItemsDialog();
    if (action == 'update') {

        modalTitle.innerText = "Edycja metody płatności"
        fillPaymentMethodForm(form, button);

    } else {

        modalTitle.innerHTML = "Dodawanie nowej metody płatności";
        form.clearAllFields();

    }
    form.removeValidation();
    similarMethodsDialog.hide();
    form.enableSubmitButton();
    form.action = "/payment-methods/" + action;
}

/**
 * Handles the event when the payment method delete modal is shown.
 * 
 * @param {Event} event - The event object.
 */
function updatePaymentMethodDeleteModalOnLoad(event) {
    const form = methodDeleteModal.querySelector(`${METHOD_DELETE_FORM_ID}`);
    const button = event.relatedTarget;
    fillDeletePaymentMethodForm(form, button);
};

/**
 * Fills the payment method form with data from the provided button.
 * @param {HTMLFormElement} form - The payment method form.
 * @param {HTMLButtonElement} button - The button containing the data to fill the form.
 */
function fillPaymentMethodForm(form, button) {
    const { id, name } = button.dataset;
    const idInput = form.querySelector(`${METHOD_EDIT_ID}`);
    idInput.value = id;
    const nameInput = form.querySelector(`${METHOD_EDIT_NAME_ID}`);
    nameInput.value = name;
}

/**
 * Fills the delete payment method form with the provided data.
 * @param {HTMLFormElement} form - The form element to fill.
 * @param {HTMLButtonElement} button - The button element containing the data.
 */
function fillDeletePaymentMethodForm(form, button) {
    const { id, name } = button.dataset;

    const idInput = form.querySelector(`${METHOD_DELETE_ID}`);
    idInput.value = id;

    const nameElement = form.querySelector("#parameter-to-delete");
    nameElement.innerText = name;

}

function clearPaymentMethodForm() {
    const form = document.querySelector(`${METHOD_EDIT_FORM_ID}`);

    form.clearAllFields();
    form.removeValidation();
    form.enableSubmitButton();
}

/**
 * Retrieves similar payment methods based on the provided method name.
 * @param {string} methodName - The name of the payment method to search for.
 * @param {number|null} ignoreMethodId - The ID of the payment method to ignore in the search.
 * @returns {Promise<Array>} - A promise that resolves to an array of similar payment methods.
 */
async function getSimilarMethods(methodName, ignoreMethodId = null) {
    try {
        const similarMethods = await fetch(`payment-methods/find-similar-payment-method?name=${methodName}&ignore_id=${ignoreMethodId}`);
        result = await similarMethods.json();
        return result;
    } catch (error) {
        console.error(error);
        return 0;
    }
}