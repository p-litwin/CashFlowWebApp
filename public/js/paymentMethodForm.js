$(document).ready(function () {
    $("#method-edit-form").validate({
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
                remote: '/payment-methods/validate'
            }
        },
        messages: {
            name: {
                remote: 'Metoda płatności już istnieje w bazie'
            }
        }
    });
});

let paymentMethodEditModal = document.getElementById('method-edit-modal')
if (paymentMethodEditModal) {
    const nameInput = paymentMethodEditModal.querySelector('#method-edit-name');
    const modalTitle = paymentMethodEditModal.querySelector('.modal-title');
    paymentMethodEditModal.addEventListener('show.bs.modal', event => {
        // Button that triggered the modal
        const button = event.relatedTarget;
        // Extract info from data-bs-* attributes
        let action = button.getAttribute('data-bs-action');
        let id = "";
        let name = "";
        if (action == 'update') {
            id = button.getAttribute('data-bs-id');
            name = button.getAttribute('data-bs-name');
            modalTitle.innerHTML = "Edycja metody płatności"
        } else {
            modalTitle.innerHTML = "Dodawanie nowej metody płatności"
        }
        let idInput = document.getElementById("method-edit-id");
        idInput.value = id;
        nameInput.value = name;
        let form = document.getElementById("method-edit-form");
        form.action = "/payment-methods/" + action;
    })
    paymentMethodEditModal.addEventListener('shown.bs.modal', event => {
        nameInput.focus();
    })
};

const categoryDeleteModal = document.getElementById('method-delete-modal')
if (categoryDeleteModal) {

    categoryDeleteModal.addEventListener('show.bs.modal', event => {
        // Button that triggered the modal
        const button = event.relatedTarget;
        // Extract info from data-bs-* attributes
        const id = button.getAttribute('data-bs-id');
        const name = button.getAttribute('data-bs-name');
        // If necessary, you could initiate an Ajax request here
        // and then do the updating in a callback.
        // Update the modal's content.
        const idInput = categoryDeleteModal.querySelector('#method-delete-id');
        idInput.value = id;
        const parameterName = categoryDeleteModal.querySelector('#parameter-to-delete');
        parameterName.innerHTML = name;
    })
};