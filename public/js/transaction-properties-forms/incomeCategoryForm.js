import { SimilarItemsDialog } from "./SimilarItemsDialog.js";
import { COMMON_VALIDATION_PARAMETERS } from "../commonFormsValidationParameters.js";
import { TransactionPropertyForm } from "./TransactionPropertyForm.js";

class IncomeCategoryForm extends TransactionPropertyForm  {
    constructor() {
        super();
        this.propertyName = "category";
        this.modalTitleEdit = "Edycja kategorii przychodu";
        this.modalTitleAdd = "Dodawanie nowej kategorii przychodu";
        this.controller = "income-categories";

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
    };

}

new IncomeCategoryForm();