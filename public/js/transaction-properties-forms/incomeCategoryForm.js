/**
 * This file contains the JavaScript code for the income category form functionality.
 * It includes form validation, event listeners, and functions for handling modals and notifications.
 * 
 * @file FILEPATH: /public/js/transaction-properties-forms/incomeCategoryForm.js
 * @since
 */

import { SimilarItemsDialog } from "./SimilarItemsDialog.js";
import { COMMON_VALIDATION_PARAMETERS } from "../commonFormsValidationParameters.js";

const CATEGORY_EDIT_FORM_ID = "#category-edit-form";
const CATEGORY_EDIT_ID = "#category-edit-id";
const CATEGORY_EDIT_NAME_ID = "#category-edit-name";
const CATEGORY_DELETE_FORM_ID = "#category-delete-form";
const CATEGORY_DELETE_ID = "#category-delete-id";

const INCOME_CATEGORY_VALIDATION_RULES = {
    required: true,
    maxlength: 50,
    remote: {
        url: '/income-categories/validate-income-category',
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
        remote: 'Kategoria przychodu już istnieje w bazie',
    }
};

$(document).ready(function () {
    $(`${CATEGORY_EDIT_FORM_ID}`).validate(COMMON_VALIDATION_PARAMETERS);
    $(`${CATEGORY_EDIT_NAME_ID}`).rules("add", INCOME_CATEGORY_VALIDATION_RULES);
});

// Event listeners for expense category forms

const categoryEditModal = document.getElementById('category-edit-modal')
if (categoryEditModal) {
    categoryEditModal.addEventListener('show.bs.modal', updateCategoryEditModalOnLoad);
    categoryEditModal.addEventListener('shown.bs.modal', () => {
        categoryEditModal.querySelector(`${CATEGORY_EDIT_NAME_ID}`).focus();
    });
};

const categoryDeleteModal = document.getElementById('category-delete-modal')
if (categoryDeleteModal) {
    categoryDeleteModal.addEventListener('show.bs.modal', updateCategoryDeleteModalOnLoad);
};

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
function updateCategoryEditModalOnLoad(event) {

    const modalTitle = categoryEditModal.querySelector('.modal-title');
    const form = categoryEditModal.querySelector(`${CATEGORY_EDIT_FORM_ID}`);
    const button = event.relatedTarget;
    const action = button.getAttribute('data-action');
    const similarCategoriesDialog = new SimilarItemsDialog();

    if (action == 'update') {

        modalTitle.innerText = "Edycja kategorii przychodu"
        fillIncomeCategoryForm(form, button);

    } else {

        modalTitle.innerText = "Dodawanie nowej kategorii przychodu";
        form.clearAllFields();

    }
    form.removeValidation();
    similarCategoriesDialog.hide();
    form.enableSubmitButton();
    form.action = "/income-categories/" + action;

}

/**
 * Handles the event when the category delete modal is shown.
 * 
 * @param {Event} event - The event object.
 */
function updateCategoryDeleteModalOnLoad(event) {
    const form = categoryDeleteModal.querySelector(`${CATEGORY_DELETE_FORM_ID}`);
    const button = event.relatedTarget;
    fillDeleteCategoryForm(form, button);
};

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
    const similarCategoriesList = new SimilarItemsDialog();

    if (categoryName != "") {

        similarCategoriesList.setConfirmationCheckboxValue(false);
        let similarCategories = await getSimilarCategories(categoryName, categoryId);

        if (similarCategories.length > 0) {

            similarCategoriesList.udpateAndDisplayList(similarCategories);
            form.disableSubmitButton();
            return;

        }
    }

    similarCategoriesList.hide();
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
    const similarCategoriesList = new SimilarItemsDialog();

    if (categoryName != "") {

        if (!similarCategoriesList.isConfirmationCheckboxChecked()) {

            event.preventDefault();
            let similarCategories = await getSimilarCategories(categoryName, categoryId);

            if (similarCategories.length > 0) {

                similarCategoriesList.udpateAndDisplayList(similarCategories);
                form.disableSubmitButton();
                return;

            }
        } else {

            const isFormInvalid = $(`${CATEGORY_EDIT_FORM_ID}`).validate().invalid;
            isFormInvalid.name === false ? form.submit() : null;

        }

        similarCategoriesList.hide();
        form.enableSubmitButton();

    }
};

/**
 * Fills the income category form with data from the provided button.
 * @param {HTMLFormElement} form - The form element to fill.
 * @param {HTMLButtonElement} button - The button element containing the data.
 */
function fillIncomeCategoryForm(form, button) {
    const { id, name } = button.dataset;

    const idInput = form.querySelector("#category-edit-id");
    idInput.value = id;

    const nameInput = form.querySelector("#category-edit-name");
    nameInput.value = name;

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
* Retrieves similar expense categories based on the provided category name.
* @param {string} categoryName - The name of the category to search for.
* @param {number|null} ignoreCategoryId - The ID of the category to ignore in the search.
* @returns {Promise<Array>} - A promise that resolves to an array of similar categories.
*/
async function getSimilarCategories(categoryName, ignoreCategoryId = null) {
    try {
        const similarCategories = await fetch(`income-categories/find-similar-category?name=${categoryName}&ignore_id=${ignoreCategoryId}`);
        let result = await similarCategories.json();
        return result;
    } catch (error) {
        console.error(error);
        return 0;
    }
}