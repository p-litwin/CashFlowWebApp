/**
 * This file contains the JavaScript code for the expense category form functionality.
 * It includes form validation, event listeners, and functions for handling modals and notifications.
 * 
 * @file FILEPATH: /public/js/expenseCategoryForm.js
 * @since
 */

const CATEGORY_EDIT_FORM_ID = "#category-edit-form";
const SIMILAR_CATEGORIES_NOTIFICATION_ID = "#similar-categories-notification";
const CATEGORY_EDIT_ID = "#category-edit-id";
const CATEGORY_EDIT_NAME_ID = "#category-edit-name";
const CATEGORY_EDIT_BUDGET_ID = "#category-edit-budget";
const CATEGORY_DELETE_FORM_ID = "#category-delete-form";
const CATEGORY_DELETE_ID = "#category-delete-id";
const SIMILAR_CATEGORY_CHECKBOX_ID = "#similar-category-checkbox";

$(document).ready(function () {

    $(`${CATEGORY_EDIT_FORM_ID}`).validate({
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
                            return $(`${CATEGORY_EDIT_NAME_ID}`).val();
                        },
                        ignore_id: function () {
                            return $(`${CATEGORY_EDIT_ID}`).val();
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

// Event listeners for expense category forms
const categoryEditModal = document.getElementById('category-edit-modal')
if (categoryEditModal) {
    categoryEditModal.addEventListener('show.bs.modal', handleCategoryEditModalShow);
    categoryEditModal.addEventListener('shown.bs.modal', event => {
        categoryEditModal.querySelector(`${CATEGORY_EDIT_NAME_ID}`).focus();
    });
};

const categoryDeleteModal = document.getElementById('category-delete-modal')
if (categoryDeleteModal) {
    categoryDeleteModal.addEventListener('show.bs.modal', handleCategoryDeleteModalShow);
}

const categoryNameInput = document.querySelector(`${CATEGORY_EDIT_NAME_ID}`);
if (categoryNameInput) {
    categoryNameInput.addEventListener('blur', handleSimilarCategoryNotification);
    categoryNameInput.addEventListener('keydown', handleEnterKeydown);
}

document.querySelector(`${SIMILAR_CATEGORY_CHECKBOX_ID}`).addEventListener('click', event => {
    const form = document.querySelector(`${CATEGORY_EDIT_FORM_ID}`);
    if (event.target.checked) {
        form.enableSubmitButton();
    } else {
        form.disableSubmitButton();
    }
});

/**
 * Handles the event when the category edit modal is shown.
 * 
 * @param {Event} event - The event object.
 */
function handleCategoryEditModalShow(event) {

    const modalTitle = categoryEditModal.querySelector('.modal-title');
    const form = categoryEditModal.querySelector(`${CATEGORY_EDIT_FORM_ID}`);
    const button = event.relatedTarget;
    const action = button.getAttribute('data-action');
    const similarCategoriesNotification = document.querySelector(`${SIMILAR_CATEGORIES_NOTIFICATION_ID}`);

    if (action == 'update') {

        modalTitle.innerText = "Edycja kategorii wydatku"
        fillExpenseCategoryForm(form, button);

    } else {

        modalTitle.innerText = "Dodawanie nowej kategorii wydatku";
        form.clearAllFields();

    }
    form.removeValidation();
    similarCategoriesNotification.hideElement();
    form.enableSubmitButton();
    form.action = "/expense-categories/" + action;

}

/**
 * Handles the event when the category delete modal is shown.
 * 
 * @param {Event} event - The event object.
 */
function handleCategoryDeleteModalShow(event) {
    const form = categoryDeleteModal.querySelector(`${CATEGORY_DELETE_FORM_ID}`);
    const button = event.relatedTarget;
    fillDeleteCategoryForm(form, button);
};

/**
 * Fills the expense category form with data from the provided button.
 * @param {HTMLFormElement} form - The expense category form.
 * @param {HTMLButtonElement} button - The button containing the data to fill the form.
 */
function fillExpenseCategoryForm(form, button) {
    const { id, name, budget } = button.dataset;

    const idInput = form.querySelector(`${CATEGORY_EDIT_ID}`);
    idInput.value = id;

    const nameInput = form.querySelector(`${CATEGORY_EDIT_NAME_ID}`);
    nameInput.value = name;

    const categoryBudget = form.querySelector(`${CATEGORY_EDIT_BUDGET_ID}`);
    categoryBudget.value = budget;
}

/**
 * Fills the delete category form with the data from the button's dataset.
 * @param {HTMLFormElement} form - The delete category form.
 * @param {HTMLButtonElement} button - The button containing the dataset.
 */
function fillDeleteCategoryForm(form, button) {
    const { id, name } = button.dataset;

    const idInput = form.querySelector(`${CATEGORY_DELETE_ID}`);
    idInput.value = id;

    const nameElement = form.querySelector("#parameter-to-delete");
    nameElement.innerText = name;

}

/**
 * Handles the keydown event for the Enter key in category name input.
 * @param {KeyboardEvent} event - The keydown event object.
 */
function handleEnterKeydown(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        handleSimilarCategoryNotification(event);
    }
}

/**
 * Handles the notification for similar category names.
 * 
 * @param {Event} event - The event object triggered by the input element.
 * @returns {Promise<Array>} - A promise that resolves when the notification is handled.
 */
async function handleSimilarCategoryNotification(event) {
    const categoryName = event.target.value;
    const categoryId = document.querySelector(`${CATEGORY_EDIT_ID}`).value;
    const similarCategories = await getSimilarCategories(categoryName, categoryId);
    const form = document.querySelector(`${CATEGORY_EDIT_FORM_ID}`);
    const similarCategoriesNotification = document.querySelector(`${SIMILAR_CATEGORIES_NOTIFICATION_ID}`);
    if (similarCategories.length > 0) {
        displaySimilarCategoriesListBelowInput(similarCategories);
        form.disableSubmitButton();
    } else {
        similarCategoriesNotification.hideElement();
        form.enableSubmitButton();
    }
}

/**
 * Displays a list of similar categories below the input field.
 * 
 * @param {Array<string>} similarCategories - The list of similar categories to display.
 */
function displaySimilarCategoriesListBelowInput(similarCategories) {
    const similarCategoriesNotification = document.querySelector(`${SIMILAR_CATEGORIES_NOTIFICATION_ID}`);
    const similarCategoriesList = document.querySelector("#similar-categories-list");
    similarCategoriesList.innerHTML = "";
    similarCategories.forEach(category => {
        const categoryElement = document.createElement("li");
        categoryElement.classList.add("similar-category-item");
        categoryElement.innerText = category;
        similarCategoriesList.appendChild(categoryElement);
        similarCategoriesNotification.showElement();
        const confirmationCheckbox = document.querySelector(`${SIMILAR_CATEGORY_CHECKBOX_ID}`);
        confirmationCheckbox.checked = false;
    });
}

/**
 * Retrieves similar expense categories based on the provided category name.
 * @param {string} categoryName - The name of the category to search for.
 * @param {number|null} ignoreCategoryId - The ID of the category to ignore in the search.
 * @returns {Promise<Array>} - A promise that resolves to an array of similar categories.
 */
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