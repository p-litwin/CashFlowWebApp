import { TransactionEditModal } from "/js/transaction-modals/TransactionEditModal.js";

/**
 * Represents a modal for editing income transactions.
 * @extends TransactionEditModal
 */
export class IncomeEditModal extends TransactionEditModal {
    
    constructor() {
        super();
        this.transactionType = "income";
        this.modalTitleEdit = "Edycja przychodu";
        this.modalTitleAdd = "Dodawanie nowego przychodu";
        this.controller = "incomes";
        this.init();
    }
}