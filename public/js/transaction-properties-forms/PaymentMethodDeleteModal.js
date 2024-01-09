import { TransactionPropertyDeleteModal } from '/js/transaction-properties-forms/TransactionPropertyDeleteModal.js';

/**
 * Represents a modal for deleting a payment method in a transaction.
 * Extends the TransactionPropertyDeleteModal class.
 */
export class PaymentMethodDeleteModal extends TransactionPropertyDeleteModal {
    constructor() {
        super();
        this.propertyName = 'method';
        this.init();
    }
}