import { TransactionEditModal } from "/js/transaction-modals/TransactionEditModal.js";

/**
 * Represents a modal for editing income transactions.
 * @extends TransactionEditModal
 */
export class ExpenseEditModal extends TransactionEditModal {

    paymentMethodValidationRules = {
        required: true,
        messages: {
            required: "Wybierz metodę płatności."
        }
    };
    
    constructor() {
        super();
        this.transactionType = "expense";
        this.modalTitleEdit = "Edycja wydatku";
        this.modalTitleAdd = "Dodawanie nowego wydatku";
        this.controller = "expenses";
        this.init();
    }

    addValidation() {
        super.addValidation();
        $(`#${this.transactionType}-edit-method`).rules("add", this.paymentMethodValidationRules);
    }

    fillTheTransactionForm(form, button) {
        super.fillTheTransactionForm(form, button);
        form.querySelector(`#${this.transactionType}-edit-method`).value = button.getAttribute('data-payment');
    }
}