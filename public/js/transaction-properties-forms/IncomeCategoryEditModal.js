import { COMMON_VALIDATION_PARAMETERS } from "../commonFormsValidationParameters.js";
import { TransactionPropertyEditModal } from "./TransactionPropertyEditModal.js";

/**
 * Represents a modal for editing income categories.
 * @class
 * @extends TransactionPropertyEditModal
 */
export class IncomeCategoryEditModal extends TransactionPropertyEditModal  {
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

    /**
     * Initializes the modal by setting up event listeners and validation rules.
     */
    init() {
        $(document).ready(() => {
            $(`#${this.propertyName}-edit-form`).validate(COMMON_VALIDATION_PARAMETERS);
            $(`#${this.propertyName}-edit-name`).rules("add", this.incomeCategoryNameValidationRules);
        });

        this.addEventListeners(this.propertyName);
    };

}