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

let expensesEditModal = document.getElementById('expensesEditModal')
if (expensesEditModal) {
    const modalAmountInput = expensesEditModal.querySelector('#expenseAmount');
    expensesEditModal.addEventListener('show.bs.modal', event => {
        // Button that triggered the modal
        const button = event.relatedTarget;
        // Extract info from data-bs-* attributes
        let action = button.getAttribute('data-bs-action');
        let id = "";
        let amount = 0.01;
        let date = "";
        let category = "";
        let payment = "";
        let comment = "";
        if (action == 'update') {
            id = button.getAttribute('data-bs-id');
            amount = button.getAttribute('data-bs-amount');
            date = button.getAttribute('data-bs-date');
            category = button.getAttribute('data-bs-category');
            payment = button.getAttribute('data-bs-payment');
            comment = button.getAttribute('data-bs-comment');
        } else {
            const today = new Date();
            let day = today.getDate();
            let month = today.getMonth() + 1;
            let year = today.getFullYear();
            date = `${year}-${month}-${day}`;
        }
        let idInput = document.getElementById("expenseId");
        idInput.value = id;
        let dateInput = document.getElementById("expenseDate");
        dateInput.value = date;
        let categorySelect = document.getElementById("expenseCategory");
        categorySelect.value = category;
        let paymentSelect = document.getElementById("paymentMethod");
        paymentSelect.value = payment;
        let commentTexarea = document.getElementById("expenseComment");
        commentTexarea.textContent = comment;
        modalAmountInput.value = amount;
        let form = document.getElementById("expenseForm");
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