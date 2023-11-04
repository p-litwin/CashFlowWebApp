$(document).ready(function () {

  $("#expenseCategoryForm").validate({
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

const categoryEditModal = document.getElementById('categoryEditModal')
if (paymentMethodEditModal) {
    const nameInput = paymentMethodEditModal.querySelector('#categoryName');
    paymentMethodEditModal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget;
    // Extract info from data-bs-* attributes
    const id = button.getAttribute('data-bs-id');
    const category = button.getAttribute('data-bs-category');

    // If necessary, you could initiate an Ajax request here
    // and then do the updating in a callback.
    // Update the modal's content.
    var idInput = document.getElementById("categoryId");
    idInput.value = id;
    var categorySelect = document.getElementById("categoryName");
    if (category != null){
    categorySelect.value = category;
    }
  })
  paymentMethodEditModal.addEventListener('shown.bs.modal', event => {
    nameInput.focus();
})
};

const categoryDeleteModal = document.getElementById('categoryDeleteModal')
if (categoryDeleteModal) {
    
    categoryDeleteModal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget;
    // Extract info from data-bs-* attributes
    const id = button.getAttribute('data-bs-id');
    // If necessary, you could initiate an Ajax request here
    // and then do the updating in a callback.
    // Update the modal's content.
    const idInput = categoryDeleteModal.querySelector('#categoryDeleteId');
    idInput.value = id;
  })
};