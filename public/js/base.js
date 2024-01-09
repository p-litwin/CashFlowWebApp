/**
 * Object containing month names in Polish.
 * @type {Object<number, string>}
 */
const MONTH_NAMES = {
    1: 'Styczeń',
    2: 'Luty',
    3: 'Marzec',
    4: 'Kwiecień',
    5: 'Maj',
    6: 'Czerwiec',
    7: 'Lipiec',
    8: 'Sierpień',
    9: 'Wrzesień',
    10: 'Październik',
    11: 'Listopad',
    12: 'Grudzień'
};

//Localization options for  date range picker
let dateRangePickerLocale = {
    customRangeLabel: 'Dowolny zakres',
    format: "YYYY-MM-DD",
    daysOfWeek: [
        "Pn",
        "Wt",
        "Śr",
        "Czw",
        "Pt",
        "Sob",
        "Nd"
    ],
    monthNames: [
        MONTH_NAMES[1],
        MONTH_NAMES[2],
        MONTH_NAMES[3],
        MONTH_NAMES[4],
        MONTH_NAMES[5],
        MONTH_NAMES[6],
        MONTH_NAMES[7],
        MONTH_NAMES[8],
        MONTH_NAMES[9],
        MONTH_NAMES[10],
        MONTH_NAMES[11],
        MONTH_NAMES[12]
    ]
};

//Close flash message if the 'x' is clicked
jQuery(".btn-close").click(function() {
    var contentPanelId = "#" + jQuery(this).parent().parent().parent().attr("id");
    $(contentPanelId).remove();
});

//Close flash message after 2,5 seconds
$(".btn-close").show(function() {
    var contentPanelId = "#" + jQuery(this).parent().parent().parent().attr("id");
    setTimeout(function() {$(contentPanelId).remove();}, 2500);
});

//Close modal when Esc button is pressed
$(document).ready(function(){
    $('.modal').modal({
        keyboard: true
      })
})

HTMLElement.prototype.clearAllFields = function() {
    const containerId = this.getAttribute('id');
    const expenseFormFields = document.querySelector(`#${containerId}`).querySelectorAll("input, select, textarea, checkbox, radio");
    expenseFormFields.forEach(field => {
        field.value = '';
    })
};

HTMLElement.prototype.removeValidation = function() {
    const containerId = this.getAttribute('id');
    const expenseFormFields = document.querySelector(`#${containerId}`).querySelectorAll("input, select, textarea, checkbox, radio");
    expenseFormFields.forEach(field => {
        field.classList.remove('is-invalid');
        field.classList.remove('is-valid');
        if (field.previousElementSibling) {
            field.previousElementSibling.classList.remove('is-invalid');
            field.previousElementSibling.classList.remove('is-valid');
        }
        if (field.nextElementSibling && field.nextElementSibling.classList.contains('is-invalid')) {
            field.nextElementSibling.remove();
        }
    })
};

HTMLElement.prototype.enableSubmitButton = function() {
    const formId = this.getAttribute('id');
    const submitButton = document.querySelector(`#${formId} > button[type='submit']`);
    submitButton.disabled = false;
};

HTMLElement.prototype.disableSubmitButton = function() {
    const formId = this.getAttribute('id');
    const submitButton = document.querySelector(`#${formId} > button[type='submit']`);
    submitButton.disabled = true;
};

/**
 * Shows the specified element by changing its display style.
 * @param {string} [type='block'] - The display style to be applied to the element. Defaults to 'block'.
 */
HTMLElement.prototype.showElement = function(type = `block`) {
    this.style.display = type;
}

/**
 * Hides the specified element by setting its display property to "none".
 */
HTMLElement.prototype.hideElement = function() {
    this.style.display = "none";
}

/**
 * Handles the keydown event for the Enter key.
 * @param {KeyboardEvent} event - The keydown event object.
 */
function preventDefaultEnterKeyBehoviour(event) {
    event.key === "Enter" ? event.preventDefault() : null;
}

/**
 * Converts a number or string to a float with comma as decimal separator.
 * If the input is not a valid number or string, it returns '0'.
 * @param {number|string} number - The number or string to be converted.
 * @returns {string} - The converted number as a string with comma as decimal separator.
 */
function convertToFloatWithComma(number) {
    if (typeof number !== 'number' && typeof number !== 'string') {
        return '0';
    }

    if (typeof number === 'string') {
        number = number.trim();
    }

    const parsedNumber = Number.parseFloat(number);

    if (Number.isNaN(parsedNumber)) {
        return '0';
    }

    return parsedNumber.toFixed(2).replace('.', ',');
}