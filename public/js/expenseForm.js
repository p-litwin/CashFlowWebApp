$(document).ready(function () {
    $("#expense-edit-form").validate({
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
                min: 0.01
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

let expensesEditModal = document.getElementById('expense-edit-modal')
if (expensesEditModal) {
    const modalAmountInput = expensesEditModal.querySelector('#expense-edit-amount');
    const modalTitle = expensesEditModal.querySelector('.modal-title');
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
            modalTitle.innerHTML = 'Edycja wydatku';
        } else {
            const today = new Date();
            let day = today.getDate();
            let month = today.getMonth() + 1;
            let year = today.getFullYear();
            date = `${year}-${month}-${day}`;
            modalTitle.innerHTML = 'Dodawanie nowego wydatku';
        }
        let idInput = document.getElementById("expense-edit-id");
        idInput.value = id;
        let dateInput = document.getElementById("expense-edit-date");
        dateInput.value = date;
        let categorySelect = document.getElementById("expense-edit-category");
        categorySelect.value = category;
        let paymentSelect = document.getElementById("expense-edit-method");
        paymentSelect.value = payment;
        let commentTexarea = document.getElementById("expense-edit-comment");
        commentTexarea.textContent = comment;
        modalAmountInput.value = amount;
        let form = document.getElementById("expense-edit-form");
        form.action = "/expenses/" + action;
    })
    expensesEditModal.addEventListener('shown.bs.modal', event => {
        modalAmountInput.focus();
    })
};

$('.transaction-form-button').on('click', function () {
    $('#expense-edit-date').daterangepicker({
        singleDatePicker: true,
        autoUpdateInput: true,
        showDropdowns: true,
        autoApply: true,
        locale: dateRangePickerLocale,
        parentEl: "#expense-edit-form"
    });
});