$(document).ready(function () {

  $("#paymentMethodAddForm").validate({
      errorClass: "is-invalid",
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
            maxlength: 50
          }
      }
  });
  $("#paymentMethodEditForm").validate({
    errorClass: "is-invalid",
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
          maxlength: 50
        }
    }
});
});



const paymentMethodEditModal = document.getElementById('paymentMethodEditModal')
if (paymentMethodEditModal) {
    const nameInput = paymentMethodEditModal.querySelector('#paymentMethodEditName');
    paymentMethodEditModal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget;
    // Extract info from data-bs-* attributes
    const id = button.getAttribute('data-bs-id');
    const paymentMethod = button.getAttribute('data-bs-method');

    // If necessary, you could initiate an Ajax request here
    // and then do the updating in a callback.
    // Update the modal's content.
    const idInput = document.getElementById("paymentMethodEditId");
    idInput.value = id;
    nameInput.value = paymentMethod;
  
  })
  paymentMethodEditModal.addEventListener('shown.bs.modal', event => {
    nameInput.focus();
})
};

const paymentMethodDeleteModal = document.getElementById('paymentMethodDeleteModal')
if (paymentMethodDeleteModal) {
    
    paymentMethodDeleteModal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget;
    // Extract info from data-bs-* attributes
    const id = button.getAttribute('data-bs-id');
    // If necessary, you could initiate an Ajax request here
    // and then do the updating in a callback.
    // Update the modal's content.
    const idInput = paymentMethodDeleteModal.querySelector('#paymentMethodDeleteId');
    idInput.value = id;
  })
};