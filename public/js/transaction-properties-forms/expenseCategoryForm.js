import { SimilarItemsDialog } from "./SimilarItemsDialog.js";
import { COMMON_VALIDATION_PARAMETERS } from "../commonFormsValidationParameters.js";
import { TransactionPropertyForm } from "./TransactionPropertyForm.js";

class ExpenseCategoryForm extends TransactionPropertyForm  {
    constructor() {
        super();
        this.propertyName = "category";
        this.modalTitleEdit = "Edycja kategorii wydatku";
        this.modalTitleAdd = "Dodawanie nowej kategorii wydatku";
        this.controller = "expense-categories";

        this.incomeCategoryNameValidationRules = {
            required: true,
            maxlength: 50,
            remote: {
                url: '/expense-categories/validate-expense-category',
                data: {
                    name: () => $(`#${this.propertyName}-edit-name`).val(),
                    ignore_id: () => $(`#${this.propertyName}-edit-id`).val()
                }
            },
            messages: {
                remote: 'Kategoria wydatku już istnieje w bazie',
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

new ExpenseCategoryForm();