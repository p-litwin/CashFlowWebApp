$(document).ready(function () {
    $("#income-edit-form").validate({
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

let incomeEditModal = document.getElementById('income-edit-modal')
if (incomeEditModal) {
    const modalAmountInput = incomeEditModal.querySelector('#income-edit-amount');
    const modalTitle = incomeEditModal.querySelector('.modal-title');
    incomeEditModal.addEventListener('show.bs.modal', event => {
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
            modalTitle.innerHTML = "Edycja przychodu";
        } else {
            const today = new Date();
            let day = today.getDate();
            let month = today.getMonth() + 1;
            let year = today.getFullYear();
            date = `${year}-${month}-${day}`;
            modalTitle.innerHTML = "Dodawanie nowego przychodu";
        }
        let idInput = document.getElementById("income-edit-id");
        idInput.value = id;
        let dateInput = document.getElementById("income-edit-date");
        dateInput.value = date;
        let categorySelect = document.getElementById("income-edit-category");
        categorySelect.value = category;
        let commentTexarea = document.getElementById("income-edit-comment");
        commentTexarea.textContent = comment;
        modalAmountInput.value = amount;
        let form = document.getElementById("income-edit-form");
        form.action = "/incomes/" + action;
    })
    incomeEditModal.addEventListener('shown.bs.modal', event => {
        modalAmountInput.focus();
    })
};

$('.transaction-form-button').on('click', function () {
    $('#income-edit-date').daterangepicker({
        singleDatePicker: true,
        autoUpdateInput: true,
        showDropdowns: true,
        autoApply: true,
        locale: dateRangePickerLocale,
        parentEl: "#income-edit-form"
    });
});