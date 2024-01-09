import { TransactionPropertyDeleteModal } from "./TransactionPropertyDeleteModal.js";

/**
 * Represents a modal for deleting a category in a transaction property.
 * @extends TransactionPropertyDeleteModal
 */
export class CategoryDeleteModal extends TransactionPropertyDeleteModal {

    constructor() {
        super();
        this.propertyName = 'category';
        this.init();
    }
     
}