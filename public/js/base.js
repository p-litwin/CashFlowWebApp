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
        "Sty",
        "Lut",
        "Mar",
        "Kwi",
        "Maj",
        "Cze",
        "Lip",
        "Sie",
        "Wrz",
        "Paź",
        "Lis",
        "Gru"
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

HTMLElement.prototype.clearAllFields = function () {
    const containerId = this.getAttribute('id');
    const expenseFormFields = document.querySelector(`#${containerId}`).querySelectorAll("input, select, textarea, checkbox, radio");
    expenseFormFields.forEach(field => {
        field.value = '';
    })
};

/**
 * Converts a number to a float with comma as decimal separator and two decimal places.
 * If the input is not a valid number, it returns 0.
 *
 * @param {number|string} number - The number to be converted.
 * @returns {string} The converted number as a string with comma as decimal separator and two decimal places.
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