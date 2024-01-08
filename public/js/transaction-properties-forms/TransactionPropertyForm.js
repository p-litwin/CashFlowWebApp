import { SimilarItemsDialog } from "./SimilarItemsDialog.js";

export class TransactionPropertyForm {

    /**
     * The name of the property (eg. Category, Payment method, etc.)
     * @type {string|null}
     */
    propertyName = null;
    /**
     * The controller for the transaction property form.
     * @type {null}
     */
    controller = null;

    constructor() {
        if (new.target === TransactionPropertyForm) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
    }

    init() {

        this.addEventListeners();
    }

    addEventListeners(propertyName) {
        const propertyModal = document.querySelector(`#${this.propertyName}-edit-modal`)
        if (propertyModal) {
            propertyModal.addEventListener('show.bs.modal', this.updatePropertyEditModalOnLoad.bind(this));
            propertyModal.addEventListener('shown.bs.modal', () => {
                propertyModal.querySelector(`#${this.propertyName}-edit-name`).focus();
            });
        };

        const propertyDeleteModal = document.querySelector(`#${propertyName}-delete-modal`)
        if (propertyDeleteModal) {
            propertyDeleteModal.addEventListener('show.bs.modal', this.updatePropertyDeleteModalOnLoad.bind(this));
        };

        const propertyNameInput = document.querySelector(`#${this.propertyName}-edit-name`);
        if (propertyNameInput) {
            propertyNameInput.addEventListener('keydown', preventDefaultEnterKeyBehoviour.bind(this));
            propertyNameInput.addEventListener('input', this.checkForSimilarItemsOnInput.bind(this));
        }

        const submitButton = document.querySelector(`#${this.propertyName}-edit-form > button[type='submit']`);
        if (submitButton) {
            submitButton.addEventListener('click', this.checkForSimilarItemsOnSubmit.bind(this));
        };
    }

    updatePropertyEditModalOnLoad(event) {
        const propertyEditModal = event.target;
        const modalTitle = propertyEditModal.querySelector('.modal-title');
        const form = propertyEditModal.querySelector(`#${this.propertyName}-edit-form`);
        const button = event.relatedTarget;
        const action = button.getAttribute('data-action');
        const similarCategoriesDialog = new SimilarItemsDialog();

        if (action == 'update') {

            modalTitle.innerText = `${this.modalTitleEdit}`
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

    updatePropertyDeleteModalOnLoad(event) {
        const deleteModal = event.target;
        const form = deleteModal.querySelector(`#${this.propertyName}-delete-form`);
        const button = event.relatedTarget;
        this.fillPropertyDeleteForm(form, button);
    }

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

    fillPropertyEditForm(form, button) {
        const { id, name } = button.dataset;

        const idInput = form.querySelector(`#${this.propertyName}-edit-id`);
        idInput.value = id;

        const nameInput = form.querySelector(`#${this.propertyName}-edit-name`);
        nameInput.value = name;
    }

    fillPropertyDeleteForm(form, button) {
        const { id, name } = button.dataset;

        const idInput = form.querySelector(`#${this.propertyName}-delete-id`);
        idInput.value = id;

        const nameElement = form.querySelector("#parameter-to-delete");
        nameElement.innerText = name;
    }

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