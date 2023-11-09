$(document).ready(function () {

  $("#category-edit-form").validate({
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

let categoryEditModal = document.getElementById('category-edit-modal')
if (categoryEditModal) {
    const nameInput = categoryEditModal.querySelector('#category-name');
    categoryEditModal.addEventListener('show.bs.modal', event => {
        // Button that triggered the modal
        const button = event.relatedTarget;
        // Extract info from data-bs-* attributes
        let action = button.getAttribute('data-bs-action');
        let id = "";
        let category = "";
        if (action == 'update') {
            id = button.getAttribute('data-bs-id');
            category = button.getAttribute('data-bs-category');
        }
        let idInput = document.getElementById("category-edit-id");
        idInput.value = id;
        let categoryInput = document.getElementById("category-name");
        categoryInput.value = category;
        let form = document.getElementById("category-edit-form");
        form.action = "/settings/expense-category-" + action;
    })
    categoryEditModal.addEventListener('shown.bs.modal', event => {
        nameInput.focus();
    })
};

///************************ */

const categoryDeleteModal = document.getElementById('category-delete-modal')
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