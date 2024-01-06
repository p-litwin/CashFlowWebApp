/**
 * This file contains the JavaScript code for the expense category form functionality.
 * It includes form validation, event listeners, and functions for handling modals and notifications.
 * 
 * @file FILEPATH: /public/js/transaction-properties-forms/expenseCategoryForm.js
 * @since
 */

const SIMILAR_CATEGORIES_NOTIFICATION_ID = "#similar-categories-notification";
const SIMILAR_CATEGORY_CHECKBOX_ID = "#similar-category-checkbox";

const CATEGORY_EDIT_FORM_ID = "#category-edit-form";
const CATEGORY_EDIT_ID = "#category-edit-id";
const CATEGORY_EDIT_NAME_ID = "#category-edit-name";
const CATEGORY_EDIT_BUDGET_ID = "#category-edit-budget";
const CATEGORY_DELETE_FORM_ID = "#category-delete-form";
const CATEGORY_DELETE_ID = "#category-delete-id";

const EXPENSE_CATEGORY_VALIDATION_RULES = {
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
    },
    messages: {
        remote: 'Kategoria wydatku już istnieje w bazie',
    }
};

const EXPENSE_BUDGET_VALIDATION_RULES = {
    pattern: /^(\d+(?:[\.\,]\d{1,2})?)$/,
    messages: {
        pattern: "Podaj wartość w formacie 0,00"
    }
};

$(document).ready(function () {
    $(`${CATEGORY_EDIT_FORM_ID}`).validate(COMMON_VALIDATION_PARAMETERS);
    $(`${CATEGORY_EDIT_NAME_ID}`).rules("add", EXPENSE_CATEGORY_VALIDATION_RULES);
    $(`${CATEGORY_EDIT_BUDGET_ID}`).rules("add", EXPENSE_BUDGET_VALIDATION_RULES);
});

// Event listeners for expense category forms
const categoryEditModal = document.getElementById('category-edit-modal')
if (categoryEditModal) {
    categoryEditModal.addEventListener('show.bs.modal', updateCategoryEditModalShow);
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
    categoryNameInput.addEventListener('keydown', preventDefaultEnterKeyBehoviour);
    categoryNameInput.addEventListener('input', checkForSimilarItemsOnInput);
}

const submitButton = document.querySelector(`${CATEGORY_EDIT_FORM_ID} > button[type='submit']`);
if (submitButton) {
    submitButton.addEventListener('click', checkForSimilarItemsOnSubmit);
};

/**
 * Handles the event when the category edit modal is shown.
 * 
 * @param {Event} event - The event object.
 */
function updateCategoryEditModalShow(event) {

    const modalTitle = categoryEditModal.querySelector('.modal-title');
    const form = categoryEditModal.querySelector(`${CATEGORY_EDIT_FORM_ID}`);
    const button = event.relatedTarget;
    const action = button.getAttribute('data-action');
    const similarCategoriesDialog = new similarItemsDialog();

    if (action == 'update') {

        modalTitle.innerText = "Edycja kategorii wydatku"
        fillExpenseCategoryForm(form, button);

    } else {

        modalTitle.innerText = "Dodawanie nowej kategorii wydatku";
        form.clearAllFields();

    }
    form.removeValidation();
    similarCategoriesDialog.hide();
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
 * Checks for similar items on category name input.
 * 
 * @param {Event} event - The input event.
 * @returns {Promise<void>} - A promise that resolves when the function completes.
 */
async function checkForSimilarItemsOnInput(event) {

    const form = document.querySelector(`${CATEGORY_EDIT_FORM_ID}`);
    const categoryName = document.querySelector(`${CATEGORY_EDIT_NAME_ID}`).value;
    const categoryId = document.querySelector(`${CATEGORY_EDIT_ID}`).value;
    const similarCategoriesList = new similarItemsDialog();

    if (categoryName != "") {

        similarCategoriesList.setConfirmationCheckboxValue(false);
        const similarCategories = await getSimilarCategories(categoryName, categoryId);

        if (similarCategories.length > 0) {

            similarCategoriesList.udpateAndDisplayList(similarCategories);
            form.disableSubmitButton();
            delete similarCategoriesList;
            return;

        }
    }

    similarCategoriesList.hide();
    delete similarCategoriesList;
    form.enableSubmitButton();

}

/**
 * Checks for similar items on category name input.
 * 
 * @param {Event} event - The input event.
 * @returns {Promise<void>} - A promise that resolves when the function completes.
 */
async function checkForSimilarItemsOnSubmit(event) {

    const form = document.querySelector(`${CATEGORY_EDIT_FORM_ID}`);
    const categoryName = document.querySelector(`${CATEGORY_EDIT_NAME_ID}`).value;
    const categoryId = document.querySelector(`${CATEGORY_EDIT_ID}`).value;
    const similarCategoriesList = new similarItemsDialog();

    if (categoryName != "") {

        if (!similarCategoriesList.isConfirmationCheckboxChecked()) {

            event.preventDefault();
            const similarCategories = await getSimilarCategories(categoryName, categoryId);

            if (similarCategories.length > 0) {

                similarCategoriesList.udpateAndDisplayList(similarCategories);
                form.disableSubmitButton();
                delete similarCategoriesList;
                return;

            }
        } else {

            const isFormInvalid = $(`${CATEGORY_EDIT_FORM_ID}`).validate().invalid;
            isFormInvalid.name === false ? form.submit() : null;

        }

        similarCategoriesList.hide();
        delete similarCategoriesList;
        form.enableSubmitButton();

    }
};

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