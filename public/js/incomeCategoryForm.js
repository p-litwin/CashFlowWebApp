$(document).ready(function () {
  $("#category-edit-form").validate({
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
          remote: '/settings/validate-income-category'
      }
  },
  messages: {
      name: {
          remote: 'Kategoria już istnieje w bazie'
      }
  }
  });
});

let categoryEditModal = document.getElementById('category-edit-modal')
if (categoryEditModal) {
  const nameInput = categoryEditModal.querySelector('#category-edit-name');
  const modalTitle = categoryEditModal.querySelector('.modal-title');
  categoryEditModal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget;
    // Extract info from data-bs-* attributes
    let action = button.getAttribute('data-bs-action');
    let id = "";
    let name = "";
    if (action == 'update') {
      id = button.getAttribute('data-bs-id');
      name = button.getAttribute('data-bs-name');
      modalTitle.innerHTML = "Edycja kategorii przychodu"
    } else {
      modalTitle.innerHTML = "Dodawanie nowej kategorii przychodu"
    }
    let idInput = document.getElementById("category-edit-id");
    idInput.value = id;
    nameInput.value = name;
    let form = document.getElementById("category-edit-form");
    form.action = "/settings/income-category-" + action;
  })
  categoryEditModal.addEventListener('shown.bs.modal', event => {
    nameInput.focus();
  })
};

const categoryDeleteModal = document.getElementById('category-delete-modal')
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
    const idInput = categoryDeleteModal.querySelector('#category-delete-id');
    idInput.value = id;
    const categoryName = categoryDeleteModal.querySelector('#parameter-to-delete');
    categoryName.innerHTML = name;
  })
};