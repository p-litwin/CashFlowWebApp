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

$(".btn-close").show(function() {
    var contentPanelId = "#" + jQuery(this).parent().parent().parent().attr("id");
    setTimeout(function() {$(contentPanelId).remove();}, 2500);
});


const transactionDeleteModal = document.getElementById('transactionDeleteModal')
if (transactionDeleteModal) {
    transactionDeleteModal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget;
    // Extract info from data-bs-* attributes
    const id = button.getAttribute('data-bs-id');
    const type = button.getAttribute('data-bs-type');
    // If necessary, you could initiate an Ajax request here
    // and then do the updating in a callback.
    // Update the modal's content.
    var idInput = document.getElementById("transactionDeleteId");
    idInput.value = id;
    var form = document.getElementById("transactionDeleteForm");
    form.action = "/" + type + "/delete";
  })
};