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
          remote: {
            url: '/income-categories/validate-income-category',
            data: {
                name: function () {
                    return $("#category-edit-name").val();
                },
                ignore_id: function () {
                    return $("#category-edit-id").val();
                }
            }
        }
      }
  },
  messages: {
      name: {
          remote: 'Kategoria już istnieje w bazie'
      }
  }
  });
});

const categoryEditModal = document.getElementById('category-edit-modal')
if (categoryEditModal) {

    const modalTitle = categoryEditModal.querySelector('.modal-title');
    const form = categoryEditModal.querySelector("#category-edit-form");

    categoryEditModal.addEventListener('show.bs.modal', event => {
        // Button that triggered the modal
        const button = event.relatedTarget;
        // Extract info from data-bs-* attributes
        const action = button.getAttribute('data-action');
        if (action == 'update') {

            modalTitle.innerText = "Edycja kategorii przychodu"
            fillIncomeCategoryForm(form, button);
            form.removeValidation();

        } else {
            
            modalTitle.innerHTML = "Dodawanie nowej kategorii przychodu";
            form.clearAllFields();
            form.removeValidation();
        }
        
        form.action = "/income-categories/" + action;

    })
};

categoryEditModal.addEventListener('shown.bs.modal', event => {
  nameInput.focus();
});

const categoryDeleteModal = document.getElementById('category-delete-modal')
if (categoryDeleteModal) {

  const form = categoryDeleteModal.querySelector("#category-delete-form");

  categoryDeleteModal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget;
    fillDeleteCategoryForm(form, button);

  })
};

function fillIncomeCategoryForm(form, button) {
  const {id,  name} = button.dataset;
  
  const idInput = form.querySelector("#category-edit-id");
  idInput.value = id;

  const nameInput = form.querySelector("#category-edit-name");
  nameInput.value = name;

}

function fillDeleteCategoryForm(form, button) {
  const {id,  name} = button.dataset;
  
  const idInput = form.querySelector("#category-delete-id");
  idInput.value = id;

  const nameElement = form.querySelector("#parameter-to-delete");
  nameElement.innerText = name;

}