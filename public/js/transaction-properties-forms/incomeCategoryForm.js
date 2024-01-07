import { SimilarItemsDialog } from "./SimilarItemsDialog.js";
import { COMMON_VALIDATION_PARAMETERS } from "../commonFormsValidationParameters.js";
import { TransactionPropertyForm } from "./TransactionPropertyForm.js";

class IncomeCategoryForm extends TransactionPropertyForm  {
    constructor() {
        super();
        this.propertyName = "category";

        this.incomeCategoryNameValidationRules = {
            required: true,
            maxlength: 50,
            remote: {
                url: '/income-categories/validate-income-category',
                data: {
                    name: () => $(`#${this.propertyName}-edit-name`).val(),
                    ignore_id: () => $(`#${this.propertyName}-edit-id`).val()
                }
            },
            messages: {
                remote: 'Kategoria przychodu już istnieje w bazie',
            }
        };

        this.init();
        
    }

    init() {
        $(document).ready(() => {
            $(`#${this.propertyName}-edit-form`).validate(COMMON_VALIDATION_PARAMETERS);
            $(`#${this.propertyName}-edit-name`).rules("add", this.incomeCategoryNameValidationRules);
        });

        this.addEventListeners(this.propertyName);
    }

    updatePropertyEditModalOnLoad(event) {
        const propertyEditModal = event.target;
        const modalTitle = propertyEditModal.querySelector('.modal-title');
        const form = propertyEditModal.querySelector(`#${this.propertyName}-edit-form`);
        const button = event.relatedTarget;
        const action = button.getAttribute('data-action');
        const similarCategoriesDialog = new SimilarItemsDialog();

        if (action == 'update') {

            modalTitle.innerText = "Edycja kategorii przychodu"
            this.fillPropertyEditForm(form, button);

        } else {

            modalTitle.innerText = "Dodawanie nowej kategorii przychodu";
            form.clearAllFields();

        }
        form.removeValidation();
        similarCategoriesDialog.hide();
        form.enableSubmitButton();
        form.action = "/income-categories/" + action;
    }

    async getSimilarProperties(propertyName, ignorePropertyId = null) {
        try {
            const similarProperties = await fetch(`income-categories/find-similar-category?name=${propertyName}&ignore_id=${ignorePropertyId}`);
            let result = await similarProperties.json();
            return result;
        } catch (error) {
            console.error(error);
            return 0;
        }
    }
}

new IncomeCategoryForm();