[1mdiff --git a/public/js/transaction-properties-forms/incomeCategoryForm.js b/public/js/transaction-properties-forms/incomeCategoryForm.js[m
[1mindex e2556f5..63392bb 100644[m
[1m--- a/public/js/transaction-properties-forms/incomeCategoryForm.js[m
[1m+++ b/public/js/transaction-properties-forms/incomeCategoryForm.js[m
[36m@@ -7,6 +7,7 @@[m
  */[m
 [m
 import { SimilarItemsDialog } from "./SimilarItemsDialog.js";[m
[32m+[m[32mimport { COMMON_VALIDATION_PARAMETERS } from "../commonFormsValidationParameters.js";[m
 [m
 const CATEGORY_EDIT_FORM_ID = "#category-edit-form";[m
 const CATEGORY_EDIT_ID = "#category-edit-id";[m
[36m@@ -80,7 +81,7 @@[m [mfunction updateCategoryEditModalOnLoad(event) {[m
     if (action == 'update') {[m
 [m
         modalTitle.innerText = "Edycja kategorii przychodu"[m
[31m-        fillIncomeCategoryForm(form, button);[m
[32m+[m[32m        fillEditForm(form, button, CATEGORY_EDIT_ID, CATEGORY_EDIT_NAME_ID);[m
 [m
     } else {[m
 [m
[36m@@ -103,7 +104,7 @@[m [mfunction updateCategoryEditModalOnLoad(event) {[m
 function updateCategoryDeleteModalOnLoad(event) {[m
     const form = categoryDeleteModal.querySelector(`${CATEGORY_DELETE_FORM_ID}`);[m
     const button = event.relatedTarget;[m
[31m-    fillDeleteCategoryForm(form, button);[m
[32m+[m[32m    fillDeleteForm(form, button, CATEGORY_DELETE_ID);[m
 };[m
 [m
 /**[m
[36m@@ -178,38 +179,6 @@[m [masync function checkForSimilarItemsOnSubmit(event) {[m
     }[m
 };[m
 [m
[31m-/**[m
[31m- * Fills the income category form with data from the provided button.[m
[31m- * @param {HTMLFormElement} form - The form element to fill.[m
[31m- * @param {HTMLButtonElement} button - The button element containing the data.[m
[31m- */[m
[31m-function fillIncomeCategoryForm(form, button) {[m
[31m-    const { id, name } = button.dataset;[m
[31m-[m
[31m-    const idInput = form.querySelector("#category-edit-id");[m
[31m-    idInput.value = id;[m
[31m-[m
[31m-    const nameInput = form.querySelector("#category-edit-name");[m
[31m-    nameInput.value = name;[m
[31m-[m
[31m-}[m
[31m-[m
[31m-/**[m
[31m- * Fills the delete category form with the data from the button's dataset.[m
[31m- * @param {HTMLFormElement} form - The delete category form.[m
[31m- * @param {HTMLButtonElement} button - The button containing the dataset.[m
[31m- */[m
[31m-function fillDeleteCategoryForm(form, button) {[m
[31m-    const { id, name } = button.dataset;[m
[31m-[m
[31m-    const idInput = form.querySelector(`${CATEGORY_DELETE_ID}`);[m
[31m-    idInput.value = id;[m
[31m-[m
[31m-    const nameElement = form.querySelector("#parameter-to-delete");[m
[31m-    nameElement.innerText = name;[m
[31m-[m
[31m-}[m
[31m-[m
 /**[m
 * Retrieves similar expense categories based on the provided category name.[m
 * @param {string} categoryName - The name of the category to search for.[m
