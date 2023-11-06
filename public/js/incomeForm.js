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

let incomesEditModal = document.getElementById('incomesEditModal')
if (incomesEditModal) {
    const modalAmountInput = incomesEditModal.querySelector('#incomeAmount');
    incomesEditModal.addEventListener('show.bs.modal', event => {
        // Button that triggered the modal
        const button = event.relatedTarget;
        // Extract action from data-bs-* attributes
        let action = button.getAttribute('data-bs-action');
        let id = "";
        let amount = 0.01;
        let date = "";
        let category = "";
        let comment = "";
        if (action == 'update') {
            id = button.getAttribute('data-bs-id');
            amount = button.getAttribute('data-bs-amount');
            date = button.getAttribute('data-bs-date');
            category = button.getAttribute('data-bs-category');
            comment = button.getAttribute('data-bs-comment');
        } else {
            const today = new Date();
            let day = today.getDate();
            let month = today.getMonth() + 1;
            let year = today.getFullYear();
            date = `${year}-${month}-${day}`;
        }
        let idInput = document.getElementById("incomeId");
        idInput.value = id;
        let dateInput = document.getElementById("incomeDate");
        dateInput.value = date;
        let categorySelect = document.getElementById("incomeCategory");
        categorySelect.value = category;
        let commentTexarea = document.getElementById("incomeComment");
        commentTexarea.textContent = comment;
        modalAmountInput.value = amount;
        let form = document.getElementById("incomeForm");
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