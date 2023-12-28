const METHOD_EDIT_FORM_ID = "#method-edit-form";
const SIMILAR_METHODS_NOTIFICATION_ID = "#similar-methods-notification";
const METHOD_EDIT_ID = "#method-edit-id";
const METHOD_EDIT_NAME_ID = "#method-edit-name";
const METHOD_DELETE_FORM_ID = "#method-delete-form";
const METHOD_DELETE_ID = "#method-delete-id";
const SIMILAR_METHOD_CHECKBOX_ID = "#similar-method-checkbox";

$(document).ready(function () {
    $(`${METHOD_EDIT_FORM_ID}`).validate({
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
    });
});

// Event listeners for payment methods forms

const paymentMethodEditModal = document.getElementById('method-edit-modal')
if (paymentMethodEditModal) {
    paymentMethodEditModal.addEventListener('show.bs.modal', handlePaymentMethodEditModalShow);
    paymentMethodEditModal.addEventListener('shown.bs.modal', () => {
        paymentMethodEditModal.querySelector(`${METHOD_EDIT_NAME_ID}`).focus();
    });
};

const methodDeleteModal = document.getElementById('method-delete-modal')
if (methodDeleteModal) {
    methodDeleteModal.addEventListener('show.bs.modal', handlePaymentMethodDeleteModalShow);
};

/**
 * Handles the event when the payment method edit modal is shown.
 * 
 * @param {Event} event - The event object.
 */
function handlePaymentMethodEditModalShow(event) {
    const modalTitle = paymentMethodEditModal.querySelector('.modal-title');
    const form = paymentMethodEditModal.querySelector(`${METHOD_EDIT_FORM_ID}`);
    const button = event.relatedTarget;
    const action = button.getAttribute('data-action');

    if (action == 'update') {

        modalTitle.innerText = "Edycja metody płatności"
        fillPaymentMethodForm(form, button);
        form.removeValidation();

    } else {

        modalTitle.innerHTML = "Dodawanie nowej metody płatności";
        form.clearAllFields();
        form.removeValidation();
    }

    form.action = "/payment-methods/" + action;
}

/**
 * Handles the event when the payment method delete modal is shown.
 * 
 * @param {Event} event - The event object.
 */
function handlePaymentMethodDeleteModalShow(event) {
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
    const {id, name} = button.dataset;

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
    const {id, name} = button.dataset;

    const idInput = form.querySelector(`${METHOD_DELETE_ID}`);
    idInput.value = id;

    const nameElement = form.querySelector("#parameter-to-delete");
    nameElement.innerText = name;

}