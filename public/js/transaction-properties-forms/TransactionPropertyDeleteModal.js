/**
 * Represents a modal for deleting transaction properties.
 */
export class TransactionPropertyDeleteModal {
    
    /**
     * Constructs a new instance of TransactionPropertyDeleteModal.
     * @throws {Error} Cannot instantiate abstract class!
     */
    constructor() {
        if (this.constructor === TransactionPropertyDeleteModal) {
            throw new Error("Cannot instantiate abstract class!");
        }
    }

    /**
     * Initializes the delete modal by adding event listeners.
     */
    init()  {
        this.addEventListeners();
    }

    /**
     * Adds event listeners to the delete modal.
     */
    addEventListeners() {

        const propertyDeleteModal = document.querySelector(`#${this.propertyName}-delete-modal`)
        if (propertyDeleteModal) {
            propertyDeleteModal.addEventListener('show.bs.modal', this.updatePropertyDeleteModalOnLoad.bind(this));
        };

    }

    /**
     * Updates the delete modal when it is loaded.
     * @param {Event} event - The event object.
     */
    updatePropertyDeleteModalOnLoad(event) {
        const deleteModal = event.target;
        const form = deleteModal.querySelector(`#${this.propertyName}-delete-form`);
        const button = event.relatedTarget;
        this.fillPropertyDeleteForm(form, button);
    }

    /**
     * Fills the delete form with the property details.
     * @param {HTMLFormElement} form - The delete form element.
     * @param {HTMLElement} button - The button element that triggered the delete action.
     */
    fillPropertyDeleteForm(form, button) {
        const { id, name } = button.dataset;

        const idInput = form.querySelector(`#${this.propertyName}-delete-id`);
        idInput.value = id;

        const nameElement = form.querySelector("#parameter-to-delete");
        nameElement.innerText = name;
    }

}