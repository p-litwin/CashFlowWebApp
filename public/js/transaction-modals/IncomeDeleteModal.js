import { TransactionDeleteModal } from "/js/transaction-modals/TransactionDeleteModal.js";

export class IncomeDeleteModal extends TransactionDeleteModal {

    constructor() {
        super();
        this.controller = "incomes";
    }

}