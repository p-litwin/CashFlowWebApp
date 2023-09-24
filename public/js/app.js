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

// Add single date picker to element with single-date-picker class
$(document).ready(function() {

    $('.single-date-picker').daterangepicker({
        singleDatePicker: true,
        autoUpdateInput:true,
        showDropdowns:true,
        autoApply: true,
        locale: dateRangePickerLocale
    });

});

// Highlight text of the clicked textbox with auto-highlight class
function autoHighlight(textbox) {
    textbox.focus();
    textbox.select();
};

$('.auto-highlight').click(function () { autoHighlight(jQuery(this)) });