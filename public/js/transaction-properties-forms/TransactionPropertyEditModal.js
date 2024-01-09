import { SimilarItemsDialog } from "./SimilarItemsDialog.js";

/**
 * Represents a modal for editing transaction properties.
 */
export class TransactionPropertyEditModal {

    /**
     * The name of the property (eg. Category, Payment method, etc.)
     * @type {string}
     */
    propertyName;
    /**
     * The controller for the transaction property form.
     * @type {string}
     */
    controller;

    /**
     * Constructs a new instance of TransactionPropertyEditModal.
     * @throws {TypeError} Cannot construct Abstract instances directly.
     */
    constructor() {
        if (new.target === TransactionPropertyEditModal) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
    }

    /**
     * Initializes the TransactionPropertyEditModal.
     */
    init() {
        this.addEventListeners();
    }

    /**
     * Adds event listeners to the modal elements.
     */
    addEventListeners() {
        // Add event listeners for the property modal
        const propertyModal = document.querySelector(`#${this.propertyName}-edit-modal`);
        if (propertyModal) {
            propertyModal.addEventListener('show.bs.modal', this.updatePropertyEditModalOnLoad.bind(this));
            propertyModal.addEventListener('shown.bs.modal', () => {
                propertyModal.querySelector(`#${this.propertyName}-edit-name`).focus();
            });
        }

        // Add event listeners for the property name input
        const propertyNameInput = document.querySelector(`#${this.propertyName}-edit-name`);
        if (propertyNameInput) {
            propertyNameInput.addEventListener('keydown', preventDefaultEnterKeyBehoviour.bind(this));
            propertyNameInput.addEventListener('input', this.checkForSimilarItemsOnInput.bind(this));
        }

        // Add event listener for the submit button
        const submitButton = document.querySelector(`#${this.propertyName}-edit-form > button[type='submit']`);
        if (submitButton) {
            submitButton.addEventListener('click', this.checkForSimilarItemsOnSubmit.bind(this));
        }
    }

    /**
     * Updates the property edit modal on load.
     * @param {Event} event - The event object.
     */
    updatePropertyEditModalOnLoad(event) {
        const propertyEditModal = event.target;
        const modalTitle = propertyEditModal.querySelector('.modal-title');
        const form = propertyEditModal.querySelector(`#${this.propertyName}-edit-form`);
        const button = event.relatedTarget;
        const action = button.getAttribute('data-action');
        const similarCategoriesDialog = new SimilarItemsDialog();

        if (action == 'update') {
            modalTitle.innerText = `${this.modalTitleEdit}`;
            this.fillPropertyEditForm(form, button);
        } else {
            modalTitle.innerText = `${this.modalTitleAdd}`;
            form.clearAllFields();
        }

        form.removeValidation();
        similarCategoriesDialog.hide();
        form.enableSubmitButton();
        form.action = `/${this.controller}/${action}`;
    }

    /**
     * Checks for similar items on input.
     * @param {Event} event - The event object.
     */
    async checkForSimilarItemsOnInput(event) {
        const form = event.target.form;
        const propertyName = event.target.value;
        const propertyId = document.querySelector(`#${this.propertyName}-edit-id`).value;
        const similarPropertiesList = new SimilarItemsDialog();

        if (propertyName != "") {
            similarPropertiesList.setConfirmationCheckboxValue(false);
            let similarProperties = await this.getSimilarProperties(propertyName, propertyId);

            if (similarProperties.length > 0) {
                similarPropertiesList.udpateAndDisplayList(similarProperties);
                form.disableSubmitButton();
                return;
            }
        }

        similarPropertiesList.hide();
        form.enableSubmitButton();
    }

    /**
     * Checks for similar items on submit.
     * @param {Event} event - The event object.
     */
    async checkForSimilarItemsOnSubmit(event) {
        const form = event.target.form;
        const propertyName = event.target.value;
        const propertyId = document.querySelector(`#${propertyName}-edit-id`);
        if (propertyId) {
            propertyId.value = propertyId;
        }
        const similarPropertiesList = new SimilarItemsDialog();

        if (propertyName != "") {
            if (!similarPropertiesList.isConfirmationCheckboxChecked()) {
                event.preventDefault();
                let similarProperties = await this.getSimilarProperties(propertyName, propertyId);

                if (similarProperties.length > 0) {
                    similarPropertiesList.udpateAndDisplayList(similarProperties);
                    form.disableSubmitButton();
                    return;
                }
            } else {
                const isFormInvalid = $(`#${propertyName}-edit-form`).validate().invalid;
                isFormInvalid.name === false ? form.submit() : null;
            }

            similarPropertiesList.hide();
            form.enableSubmitButton();
        }
    }

    /**
     * Fills the property edit form with data.
     * @param {HTMLFormElement} form - The form element.
     * @param {HTMLElement} button - The button element.
     */
    fillPropertyEditForm(form, button) {
        const { id, name } = button.dataset;

        const idInput = form.querySelector(`#${this.propertyName}-edit-id`);
        idInput.value = id;

        const nameInput = form.querySelector(`#${this.propertyName}-edit-name`);
        nameInput.value = name;
    }

    /**
     * Retrieves similar properties from the server.
     * @param {string} propertyName - The name of the property.
     * @param {string|null} ignorePropertyId - The ID of the property to ignore.
     * @returns {Promise<Array>} The array of similar properties.
     */
    async getSimilarProperties(propertyName, ignorePropertyId = null) {
        try {
            const similarProperties = await fetch(`${this.controller}/find-similar?name=${propertyName}&ignore_id=${ignorePropertyId}`);
            let result = await similarProperties.json();
            return result;
        } catch (error) {
            console.error(error);
            return 0;
        }
    }

}