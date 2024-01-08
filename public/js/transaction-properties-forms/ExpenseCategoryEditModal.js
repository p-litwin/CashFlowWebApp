import { COMMON_VALIDATION_PARAMETERS } from "../commonFormsValidationParameters.js";
import { TransactionPropertyEditModal } from "./TransactionPropertyEditModal.js";

export class ExpenseCategoryEditModal extends TransactionPropertyEditModal  {
    constructor() {
        super();
        this.propertyName = "category";
        this.modalTitleEdit = "Edycja kategorii wydatku";
        this.modalTitleAdd = "Dodawanie nowej kategorii wydatku";
        this.controller = "expense-categories";

        this.expenseCategoryNameValidationRules = {
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
            $(`#${this.propertyName}-edit-name`).rules("add", this.expenseCategoryNameValidationRules);
        });

        this.addEventListeners(this.propertyName);
    };

}

new ExpenseCategoryEditModal();