const METHOD_EDIT_FORM_ID = "#method-edit-form";
const SIMILAR_METHODS_NOTIFICATION_ID = "#similar-methods-notification";
const METHOD_EDIT_ID = "#method-edit-id";
const METHOD_EDIT_NAME_ID = "#method-edit-name";
const METHOD_DELETE_FORM_ID = "#method-delete-form";
const METHOD_DELETE_ID = "#method-delete-id";
const SIMILAR_METHOD_CHECKBOX_ID = "#similar-method-checkbox";

const validationParameters = {
    errorClass: "is-invalid",
    validClass: "is-valid",
    errorElement: "span",
    highlight: function (element, errorClass, validClass) {
        $(element).addClass(errorClass).removeClass(validClass);
        $(element.form).find("label[for=" + element.id + "]")
            .addClass(errorClass);
    },
    unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass(errorClass).addClass(validClass);
        $(element.form).find("label[for=" + element.id + "]")
            .removeClass(errorClass);
    },
    rules: {
        name: {
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
            }
        }
    },
    messages: {
        name: {
            remote: 'Metoda płatności już istnieje w bazie'
        }
    }
};

$(document).ready(function () {
    $(`${METHOD_EDIT_FORM_ID}`).validate(validationParameters);
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
    nameInput.addEventListener('keydown', event => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSubmitForm(event);
        }
    });
}

const similarMethodCheckBox = document.querySelector(`${SIMILAR_METHOD_CHECKBOX_ID}`);
if (similarMethodCheckBox) {
    similarMethodCheckBox.addEventListener('click', toggleSubmitButton);
}

const submitButton = document.querySelector(`${METHOD_EDIT_FORM_ID} > button[type='submit']`);
if (submitButton) {
    submitButton.addEventListener('click', handleSubmitForm);
};

async function handleSubmitForm(event) {
    const form = document.querySelector(`${METHOD_EDIT_FORM_ID}`);
    const methodName = document.querySelector(`${METHOD_EDIT_NAME_ID}`).value;
    const methodId = document.querySelector(`${METHOD_EDIT_ID}`).value;
    const similarMethodCheckBox = document.querySelector(`${SIMILAR_METHOD_CHECKBOX_ID}`);
    if (methodName != "") {
        event.preventDefault();
        const similarMethods = await getSimilarMethods(methodName, methodId);
        if (similarMethods.length > 0 && similarMethodCheckBox.checked === false) {
            displaySimilarMethodsListBelowInput(similarMethods);
            form.disableSubmitButton();
        } else {
            const isFormInvalid = $(`${METHOD_EDIT_FORM_ID}`).validate(validationParameters).invalid;
            if (isFormInvalid.name === false) {
                form.submit();
            }
        }
    }
}

function toggleSubmitButton(event) {
    const form = document.querySelector(`${METHOD_EDIT_FORM_ID}`);
    if (event.target.checked) {
        form.enableSubmitButton();
    } else {
        form.disableSubmitButton();
    }
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
    const similarMethodsNotification = document.querySelector(`${SIMILAR_METHODS_NOTIFICATION_ID}`);
    if (action == 'update') {

        modalTitle.innerText = "Edycja metody płatności"
        fillPaymentMethodForm(form, button);

    } else {

        modalTitle.innerHTML = "Dodawanie nowej metody płatności";
        form.clearAllFields();
    }
    form.removeValidation();
    similarMethodsNotification.hideElement();
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

/**
 * Handles the keydown event for the Enter key in category name input.
 * @param {KeyboardEvent} event - The keydown event object.
 */
function handleEnterKeydown(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        handleSimilarMethodNotification(event);
    }
}

/**
 * Handles the notification for similar payment methods in the category.
 * @param {Event} event - The event object triggered by the input change.
 * @returns {Promise<void>} - A promise that resolves when the notification is handled.
 */
async function handleSimilarMethodNotification(event) {
    const methodName = event.target.value;
    const methodId = document.querySelector(`${METHOD_EDIT_ID}`).value;
    const similarMethods = await getSimilarMethods(methodName, methodId);
    const form = document.querySelector(`${METHOD_EDIT_FORM_ID}`);
    const similarMethodsNotification = document.querySelector(`${SIMILAR_METHODS_NOTIFICATION_ID}`);
    if (similarMethods.length > 0) {
        displaySimilarMethodsListBelowInput(similarMethods);
        form.disableSubmitButton();
    } else {
        similarMethodsNotification.hideElement();
        form.enableSubmitButton();
    }
}

/**
 * Displays a list of similar categories below the input field.
 * 
 * @param {Array} similarCategories - An array of similar categories.
 * @returns {void}
 */
function displaySimilarMethodsListBelowInput(similarCategories) {
    const similarCategoriesNotification = document.querySelector(`${SIMILAR_METHODS_NOTIFICATION_ID}`);
    const similarCategoriesList = document.querySelector("#similar-methods-list");
    similarCategoriesList.innerHTML = "";
    similarCategories.forEach(category => {
        const categoryElement = document.createElement("li");
        categoryElement.classList.add("similar-category-item");
        categoryElement.innerText = category;
        similarCategoriesList.appendChild(categoryElement);
        similarCategoriesNotification.showElement();
        const confirmationCheckbox = document.querySelector(`${SIMILAR_METHOD_CHECKBOX_ID}`);
        confirmationCheckbox.checked = false;
    });
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