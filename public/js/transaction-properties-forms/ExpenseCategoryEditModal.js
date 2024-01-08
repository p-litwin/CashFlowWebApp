import { COMMON_VALIDATION_PARAMETERS } from "../commonFormsValidationParameters.js";
import { TransactionPropertyEditModal } from "./TransactionPropertyEditModal.js";

export class ExpenseCategoryEditModal extends TransactionPropertyEditModal {
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

        this.expenseCategoryBudgetValidationRules = {
            number: true,
            min: 0,
            pattern: /^(\d+(?:[\.\,]\d{1,2})?)$/,
            messages: {
                pattern: "Podaj wartość w formacie 0,00",
                min: "Wartość musi być większa lub równa 0"
            }
        };

        this.init();

    }

    init() {
        $(document).ready(() => {
            $(`#${this.propertyName}-edit-form`).validate(COMMON_VALIDATION_PARAMETERS);
            $(`#${this.propertyName}-edit-name`).rules("add", this.expenseCategoryNameValidationRules);
            $(`#${this.propertyName}-edit-budget`).rules("add", this.expenseCategoryBudgetValidationRules);
        });

        this.addEventListeners(this.propertyName);
    };

    fillPropertyEditForm(form, button) {
        const { id, name, budget } = button.dataset;

        const idInput = form.querySelector(`#${this.propertyName}-edit-id`);
        idInput.value = id;

        const nameInput = form.querySelector(`#${this.propertyName}-edit-name`);
        nameInput.value = name;

        const budgetInput = form.querySelector(`#${this.propertyName}-edit-budget`);
        budgetInput.value = budget;
    }

}

new ExpenseCategoryEditModal();