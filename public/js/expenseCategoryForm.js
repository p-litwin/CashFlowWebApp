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
                required: true,
                maxlength: 50,
                remote: '/expense-categories/validate-expense-category'
            },
            budget: {
                pattern: /^(\d+(?:[\.\,]\d{1,2})?)$/
            }
        },
        messages: {
            name: {
                remote: 'Kategoria już istnieje w bazie'
            },
            budget: {
                pattern: "Podaj wartość w formacie 0,00"
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

            modalTitle.innerText = "Edycja kategorii wydatku"
            fillExpenseCategoryForm(form, button);
            form.removeValidation();

        } else {
            
            modalTitle.innerHTML = "Dodawanie nowej kategorii wydatku";
            form.clearAllFields();
            form.removeValidation();
        }
        
        form.action = "/expense-categories/" + action;

    })
};

categoryEditModal.addEventListener('shown.bs.modal', event => {
    categoryEditModal.querySelector('#category-edit-name').focus();
})

///************************ */

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

function fillExpenseCategoryForm(form, button) {
    const {id,  name, budget} = button.dataset;
    
    const idInput = form.querySelector("#category-edit-id");
    idInput.value = id;

    const nameInput = form.querySelector("#category-edit-name");
    nameInput.value = name;

    const categoryBudget = form.querySelector("#category-edit-budget");
    categoryBudget.value = budget;
}