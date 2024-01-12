export class TransactionDeleteModal {

    controller;

    constructor() {
        this.transactionDeleteModal = document.getElementById('transaction-delete-modal')
        this.addEventListeners();
    }

    addEventListeners() {
        if (this.transactionDeleteModal) {
            this.transactionDeleteModal.addEventListener('show.bs.modal', this.updateTransactionDeleteModalOnLoad.bind(this));
        }
    }

    updateTransactionDeleteModalOnLoad(event) {

        const button = event.relatedTarget;
        const id = button.getAttribute('data-bs-id');
        const type = button.getAttribute('data-bs-type');
        const idInput = document.getElementById("transaction-delete-id");
        idInput.value = id;
        const form = document.getElementById("transaction-delete-form");
        form.action = `/${this.controller}/delete`;

    }
}