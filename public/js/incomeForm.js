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

const incomeEditModal = document.getElementById('income-edit-modal')
if (incomeEditModal) {
    incomeEditModal.addEventListener('show.bs.modal', event => {
        // Button that triggered the modal
        const button = event.relatedTarget;
        // Extract action from data-* attributes
        const form = incomeEditModal.querySelector('#income-edit-form');
        const action = button.getAttribute('data-action');
        if (action == 'update') {
            
            // Extract transaction data from data-* attributes
            const {id, amount, date, category, comment} = button.dataset;

            const amountInput = incomeEditModal.querySelector('#income-edit-amount');
            amountInput.value = amount.replace(/\./g, ',');
            
            const idInput = document.getElementById("income-edit-id");
            idInput.value = id;

            const dateInput = document.getElementById("income-edit-date");
            dateInput.value = date;

            const categorySelect = document.getElementById("income-edit-category");
            categorySelect.value = category;

            const commentTexarea = document.getElementById("income-edit-comment");
            commentTexarea.textContent = comment;
            
            const modalTitle = incomeEditModal.querySelector('.modal-title');
            modalTitle.innerHTML = "Edycja przychodu";

        } else {

            const modalTitle = incomeEditModal.querySelector('.modal-title');
            modalTitle.innerHTML = "Dodawanie nowego przychodu";
            
            form.clearAllFields();

            document.querySelector("#add-income-button").classList.add("active");

        }

        form.action = "/incomes/" + action;

    })
    
};

incomeEditModal.addEventListener('shown.bs.modal', () => {
    document.querySelector('#income-edit-amount').focus();
})
incomeEditModal.addEventListener('hidden.bs.modal', () => {
    $("#add-income-button").removeClass("active");
})

$('.transaction-form-button').on('click', () => {
    $('#income-edit-date').daterangepicker({
        singleDatePicker: true,
        autoUpdateInput: true,
        showDropdowns: true,
        autoApply: true,
        locale: dateRangePickerLocale,
        parentEl: "#income-edit-form"
    });
});