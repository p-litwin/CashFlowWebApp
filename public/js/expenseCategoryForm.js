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
                remote: {
                    url: '/expense-categories/validate-expense-category',
                    data: {
                        name: function () {
                            return $("#category-edit-name").val();
                        },
                        ignore_id: function () {
                            return $("#category-edit-id").val();
                        }
                    }
                }
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

const categoryDeleteModal = document.getElementById('category-delete-modal')
if (categoryDeleteModal) {

    const form = categoryDeleteModal.querySelector("#category-delete-form");

    categoryDeleteModal.addEventListener('show.bs.modal', event => {
        // Button that triggered the modal
        const button = event.relatedTarget;
        fillDeleteCategoryForm(form, button);

    })
};

function fillExpenseCategoryForm(form, button) {
    const { id, name, budget } = button.dataset;

    const idInput = form.querySelector("#category-edit-id");
    idInput.value = id;

    const nameInput = form.querySelector("#category-edit-name");
    nameInput.value = name;

    const categoryBudget = form.querySelector("#category-edit-budget");
    categoryBudget.value = budget;
}

function fillDeleteCategoryForm(form, button) {
    const { id, name } = button.dataset;

    const idInput = form.querySelector("#category-delete-id");
    idInput.value = id;

    const nameElement = form.querySelector("#parameter-to-delete");
    nameElement.innerText = name;

}

document.querySelector("#category-edit-name").addEventListener('blur', async (event) => {
    const categoryName = event.target.value;
    const categoryId = document.querySelector("#category-edit-id").value;
    const similarCategories = await getSimilarCategories(categoryName, categoryId);
    if (similarCategories.length > 0) {
        const similarCategoriesList = document.querySelector("#similar-categories-list");
        similarCategoriesList.innerHTML = "";
        similarCategories.forEach(category => {
            const categoryElement = document.createElement("li");
            categoryElement.classList.add("similar-category-item");
            categoryElement.innerText = category;
            similarCategoriesList.appendChild(categoryElement);
            const similarCategoriesNotification = document.getElementById("similar-categories-notification");
            similarCategoriesNotification.style.display = "block";
        });
        const submitButton = document.querySelector("#category-edit-form > button[type='submit']");
        submitButton.disabled = true;
    }
});

document.querySelector("#similar-category-checkbox").addEventListener('click', (event) => {
    const submitButton = document.querySelector("#category-edit-form > button[type='submit']");
    submitButton.disabled = !event.target.checked;
});


async function getSimilarCategories(categoryName, ignoreCategoryId = null) {
    try {
        const similarCategories = await fetch(`expense-categories/find-similar-category?name=${categoryName}&ignore_id=${ignoreCategoryId}`);
        result = await similarCategories.json();
        return result;
    } catch (error) {
        console.error(error);
        return 0;
    }
}

