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
                remote: {
                    url: '/payment-methods/validate',
                    data: {
                        name: function () {
                            return $("#method-edit-name").val();
                        },
                        ignore_id: function () {
                            return $("#method-edit-id").val();
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

const paymentMethodEditModal = document.getElementById('method-edit-modal')
if (paymentMethodEditModal) {

    const modalTitle = paymentMethodEditModal.querySelector('.modal-title');
    const form = paymentMethodEditModal.querySelector("#method-edit-form");

    paymentMethodEditModal.addEventListener('show.bs.modal', event => {
        // Button that triggered the modal
        const button = event.relatedTarget;
        // Extract info from data-bs-* attributes
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

    })
};

paymentMethodEditModal.addEventListener('shown.bs.modal', event => {
    nameInput.focus();
});

const methodDeleteModal = document.getElementById('method-delete-modal')
if (methodDeleteModal) {

  const form = methodDeleteModal.querySelector("#method-delete-form");

  methodDeleteModal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget;
    fillDeletePaymentMethodForm(form, button);

  })
};

function fillPaymentMethodForm(form, button) {
    const {id,  name} = button.dataset;
    
    const idInput = form.querySelector("#method-edit-id");
    idInput.value = id;
  
    const nameInput = form.querySelector("#method-edit-name");
    nameInput.value = name;
  
  }
  
  function fillDeletePaymentMethodForm(form, button) {
    const {id,  name} = button.dataset;
    
    const idInput = form.querySelector("#method-delete-id");
    idInput.value = id;
  
    const nameElement = form.querySelector("#parameter-to-delete");
    nameElement.innerText = name;
  
  }