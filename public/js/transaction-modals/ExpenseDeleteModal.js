import { TransactionDeleteModal } from "/js/transaction-modals/TransactionDeleteModal.js";

export class ExpenseDeleteModal extends TransactionDeleteModal {

    constructor() {
        super();
        this.controller = "expenses";
    }

}