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

//Close flash message if the 'x' is clicked
jQuery(".btn-close").click(function() {
    var contentPanelId = "#" + jQuery(this).parent().parent().parent().attr("id");
    $(contentPanelId).remove();
});

const expensesEditModal = document.getElementById('expensesEditModal')
if (expensesEditModal) {
    expensesEditModal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget
    // Extract info from data-bs-* attributes
    const id = button.getAttribute('data-bs-id')
    const amount = button.getAttribute('data-bs-amount')
    const date = button.getAttribute('data-bs-date')
    const category = button.getAttribute('data-bs-category')
    const payment = button.getAttribute('data-bs-payment')
    const comment = button.getAttribute('data-bs-comment')
    // If necessary, you could initiate an Ajax request here
    // and then do the updating in a callback.
    // Update the modal's content.
    var idInput = document.getElementById("transactionId");
    idInput.value = id;
    var dateInput = document.getElementById("expenseDate");
    dateInput.value = date;
    var categorySelect = document.getElementById("expenseCategory");
    categorySelect.value = category;
    var paymentSelect = document.getElementById("paymentMethod");
    paymentSelect.value = payment;
    var commentTexarea = document.getElementById("expenseComment");
    commentTexarea.textContent = comment;
    const modalAmountInput = expensesEditModal.querySelector('#expenseAmount')
    modalAmountInput.value = amount
  })
}

const incomesEditModal = document.getElementById('incomesEditModal')
if (incomesEditModal) {
    incomesEditModal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget
    // Extract info from data-bs-* attributes
    const amount = button.getAttribute('data-bs-amount')
    const date = button.getAttribute('data-bs-date')
    const category = button.getAttribute('data-bs-category')
    const comment = button.getAttribute('data-bs-comment')
    // If necessary, you could initiate an Ajax request here
    // and then do the updating in a callback.
    // Update the modal's content.
    var dateInput = document.getElementById("incomeDate");
    dateInput.value = date;
    var categorySelect = document.getElementById("incomeCategory");
    categorySelect.value = category;
    var commentTexarea = document.getElementById("incomeComment");
    commentTexarea.textContent = comment;
    const modalAmountInput = incomesEditModal.querySelector('#incomeAmount')
    modalAmountInput.value = amount
  })
}