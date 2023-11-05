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

// Highlight text of the clicked textbox with auto-highlight class
function autoHighlight(textbox) {
    textbox.focus();
    textbox.select();
};

$('.auto-highlight').click(function () { autoHighlight(jQuery(this)) });

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
