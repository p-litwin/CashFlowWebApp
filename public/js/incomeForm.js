$(document).ready(function () {

    $("#incomeForm").validate({
        errorClass: "is-invalid",
        validClass:"is-valid",
        errorElement: "span",
        highlight: function (element, errorClass, validClass) {
            $(element).addClass(errorClass).removeClass(validClass);
            $(element.form).find("label[for=" + element.id + "]")
                .addClass(errorClass);
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass(errorClass).addClass(validClass);
            $(element.form).find("label[for=" + element.id + "]")
                .removeClass(errorClass);
        },
        rules: {
            amount: {
                required: true,
                pattern: /^(\d+(?:[\.\,]\d{1,2})?)$/
            },
            date: {
                required: true,
                dateISO: true
            },
            category: {
                required: true
            },
            comment: {
                maxlength: 100
            }
        }
    });



});

const incomesEditModal = document.getElementById('incomesEditModal')
if (incomesEditModal) {
    const modalAmountInput = incomesEditModal.querySelector('#incomeAmount');
    incomesEditModal.addEventListener('show.bs.modal', event => {
        // Button that triggered the modal
        const button = event.relatedTarget;
        // Extract info from data-bs-* attributes
        const id = button.getAttribute('data-bs-id');
        const amount = button.getAttribute('data-bs-amount');
        const date = button.getAttribute('data-bs-date');
        const category = button.getAttribute('data-bs-category');
        const comment = button.getAttribute('data-bs-comment');
        const action = button.getAttribute('data-bs-action');
        // If necessary, you could initiate an Ajax request here
        // and then do the updating in a callback.
        // Update the modal's content.
        var idInput = document.getElementById("incomeId");
        idInput.value = id;
        var dateInput = document.getElementById("incomeDate");
        dateInput.value = date;
        var categorySelect = document.getElementById("incomeCategory");
        categorySelect.value = category;
        var commentTexarea = document.getElementById("incomeComment");
        commentTexarea.textContent = comment;
        modalAmountInput.value = amount;
        var form = document.getElementById("incomeForm");
        form.action = "/incomes/" + action;
    })
    incomesEditModal.addEventListener('shown.bs.modal', event => {
        modalAmountInput.focus();
    })
};

$('.transaction-form-button').on('click', function () {
    $('#incomeDate').daterangepicker({
        singleDatePicker: true,
        autoUpdateInput: true,
        showDropdowns: true,
        autoApply: true,
        locale: dateRangePickerLocale,
        parentEl: "#incomeForm"
    });
});