/**
 * Represents a dialog for displaying similar items.
 */
class similarItemsDialog {
    constructor() {
        this.dialog = document.querySelector("#similar-items-notification");
        this.list = document.querySelector("#similar-items-list");
        this.confirmationCheckbox = document.querySelector("#similar-item-checkbox");
    }

    /**
     * Shows the similar items dialog.
     */
    show() {
        this.dialog.showElement();
    }

    /**
     * Hides the similar items dialog.
     * 
    */
    hide() {
        this.dialog.hideElement();
    }

    /**
     * Clears the list by removing all its child elements.
     */
    clearList() {
        this.list.innerHTML = "";
    }

    /**
     * Fills the list with similar items.
     * 
     * @param {Array} similarItems - The array of similar items to be added to the list.
     * @returns {void}
     */
    fillTheList(similarItems) {
        this.clearList();
        similarItems.forEach(item => {
            const itemElement = document.createElement("li");
            itemElement.classList.add("similar-item");
            itemElement.innerText = item;
            this.list.appendChild(itemElement);
        });
    }

    udpateAndDisplayList(similarItems) {
        this.fillTheList(similarItems);
        this.setConfirmationCheckboxValue(false);
        this.show();
    }

    /**
     * Sets the value of the confirmation checkbox.
     * @param {boolean} checked - The value to set for the checkbox.
     */
    setConfirmationCheckboxValue(checked) {
        this.confirmationCheckbox.checked = checked;
    }

    /**
     * Checks if the confirmation checkbox is checked.
     * @returns {boolean} True if the confirmation checkbox is checked, false otherwise.
     */
    isConfirmationCheckboxChecked() {
        return this.confirmationCheckbox.checked;
    }

}

const similarItemCheckBox = document.querySelector(`#similar-item-checkbox`);
if (similarItemCheckBox) {
    similarItemCheckBox.addEventListener('click', toggleSubmitButton);
}

function toggleSubmitButton(event) {
    const form = event.target.closest('form');
    if (event.target.checked) {
        form.enableSubmitButton();
    } else {
        form.disableSubmitButton();
    }
}