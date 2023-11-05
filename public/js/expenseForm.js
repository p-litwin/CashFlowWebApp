$(document).ready(function () {

    $("#expenseForm").validate({
        errorClass: "is-invalid",
        validClass: "is-valid",
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
                pattern: /^(\d+(?:[\.\,]\d{1,2})?)$/,
                min:0.01
            },
            date: {
                required: true,
                dateISO: true
            },
            category: {
                required: true
            },
            payment_method: {
                required: true
            },
            comment: {
                maxlength: 100
            }
        }
    });



});

const expensesEditModal = document.getElementById('expensesEditModal')
if (expensesEditModal) {
    const modalAmountInput = expensesEditModal.querySelector('#expenseAmount');
    expensesEditModal.addEventListener('show.bs.modal', event => {
        // Button that triggered the modal
        const button = event.relatedTarget;
        // Extract info from data-bs-* attributes
        const action = button.getAttribute('data-bs-action');
        if (action == 'update') {
            const id = button.getAttribute('data-bs-id');
            const amount = button.getAttribute('data-bs-amount');
            const date = button.getAttribute('data-bs-date');
            const category = button.getAttribute('data-bs-category');
            const payment = button.getAttribute('data-bs-payment');
            const comment = button.getAttribute('data-bs-comment');
            // If necessary, you could initiate an Ajax request here
            // and then do the updating in a callback.
            // Update the modal's content.
            var idInput = document.getElementById("expenseId");
            idInput.value = id;
            var dateInput = document.getElementById("expenseDate");
            dateInput.value = date;
            var categorySelect = document.getElementById("expenseCategory");
            categorySelect.value = category;
            var paymentSelect = document.getElementById("paymentMethod");
            paymentSelect.value = payment;
            var commentTexarea = document.getElementById("expenseComment");
            commentTexarea.textContent = comment;
            modalAmountInput.value = amount;
        }
        var form = document.getElementById("expenseForm");
        form.action = "/expenses/" + action;
    })
    expensesEditModal.addEventListener('shown.bs.modal', event => {
        modalAmountInput.focus();
    })
};

$('.transaction-form-button').on('click', function () {
    $('#expenseDate').daterangepicker({
        singleDatePicker: true,
        autoUpdateInput: true,
        showDropdowns: true,
        autoApply: true,
        locale: dateRangePickerLocale,
        parentEl: "#expenseForm"
    });
});