import { COMMON_VALIDATION_PARAMETERS } from "/js/commonFormsValidationParameters.js";

/**
 * Represents a Transaction Edit Modal.
 * @class
 */
export class TransactionEditModal {

    transactionType;

    controller;

    transactionAmountValidationRules = {
        required: true,
        pattern: /^(\d+(?:[\.\,]\d{1,2})?)$/,
        messages: {
            required: "Pole nie może być puste.",
            pattern: "Wymagany format: 0,00.",
            step: "Wymagany format: 0,00."
        }
    };

    transactionDateValidationRules = {
        required: true,
        dateISO: true,
        messages: {
            required: "Podaj datę.",
            dateISO: "Format daty jest nieprawidłowy."
        }
    };

    transactionCategoryValidationRules = {
        required: true,
        messages: {
            required: "Wybierz kategorię."
        }
    };

    transactionCommentValidationRules = {
        maxlength: 100,
        messages: {
            maxlength: "Wpisz nie więcej niż 100 znaków."
        }
    };

    /**
     * Constructs a new instance of TransactionEditModal.
     * @constructor
     * @throws {TypeError} Cannot construct Abstract instances directly.
     */
    constructor() {
        if (new.target === TransactionEditModal) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
    }

    /**
     * Initializes the Transaction Edit Modal.
     */
    init() {
        this.addEventListeners();
        this.addValidation();
    }

    /**
     * Adds event listeners to the Transaction Edit Modal.
     */
    addEventListeners() {
        const transactionEditModal = document.querySelector(`#${this.transactionType}-edit-modal`);
        if (transactionEditModal) {
            transactionEditModal.addEventListener('show.bs.modal', this.updateTransactionEditModalOnLoad.bind(this));
            transactionEditModal.addEventListener('shown.bs.modal', this.focusOnAmoutField.bind(this));
            transactionEditModal.addEventListener('hidden.bs.modal', this.handleHiddenModal.bind(this));
        };

        $(`#${this.transactionType}-edit-date`).daterangepicker({
            singleDatePicker: true,
            autoUpdateInput: true,
            showDropdowns: true,
            autoApply: true,
            locale: dateRangePickerLocale,
            parentEl: `#${this.transactionType}-edit-form`
        });
    }

    /**
     * Adds validation to the Transaction Edit Modal.
     */
    addValidation() {
        $(`#${this.transactionType}-edit-form`).validate(COMMON_VALIDATION_PARAMETERS);
        $(`#${this.transactionType}-edit-amount`).rules("add", this.transactionAmountValidationRules);
        $(`#${this.transactionType}-edit-date`).rules("add", this.transactionDateValidationRules);
        $(`#${this.transactionType}-edit-category`).rules("add", this.transactionCategoryValidationRules);
        $(`#${this.transactionType}-edit-comment`).rules("add", this.transactionCommentValidationRules);
    }

    /**
     * Updates the Transaction Edit Modal on load.
     * @param {Event} event - The event object.
     */
    updateTransactionEditModalOnLoad(event) {
        const transactionEditModal = event.target;
        const modalTitle = event.target.querySelector('.modal-title');
        const button = event.relatedTarget;
        const form = transactionEditModal.querySelector(`#${this.transactionType}-edit-form`);
        const action = button.getAttribute('data-action');
        if (action == 'update') {

            modalTitle.innerHTML = `${this.modalTitleEdit}`;
            this.fillTheTransactionForm(form, button);

        } else {

            modalTitle.innerHTML = `${this.modalTitleAdd}`;
            form.clearAllFields();
            const today = new Date().toISOString().slice(0, 10);
            form.querySelector(`#${this.transactionType}-edit-date`).value = today;
            $(`#${this.transactionType}-edit-date`).data('daterangepicker').setStartDate(today);
            button.classList.add("active");

        }

        form.removeValidation();
        form.action = `/${this.controller}/${action}`;
    }

    /**
     * Focuses on the amount field of the Transaction Edit Modal.
     */
    focusOnAmoutField() {
        document.querySelector(`#${this.transactionType}-edit-amount`).focus();
    }

    /**
     * Handles the hidden state of the Transaction Edit Modal.
     */
    handleHiddenModal() {
        document.querySelector(`#add-${this.transactionType}-button`).classList.remove('active');
    }

    /**
     * Fills the transaction form with data.
     * @param {HTMLElement} form - The transaction form element.
     * @param {HTMLElement} button - The button element.
     */
    fillTheTransactionForm(form, button) {
        const { id, amount, date, category, comment } = button.dataset;

        const dateInput = form.querySelector(`#${this.transactionType}-edit-date`);
        dateInput.value = date;

        const idInput = form.querySelector(`#${this.transactionType}-edit-id`);
        idInput.value = id;

        const categorySelect = form.querySelector(`#${this.transactionType}-edit-category`);
        categorySelect.value = category;

        const commentTexarea = form.querySelector(`#${this.transactionType}-edit-comment`);
        commentTexarea.value = comment;

        const amountInput = form.querySelector(`#${this.transactionType}-edit-amount`);
        amountInput.value = amount.replace(/\./g, ',');
    }
}