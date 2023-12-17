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

        const form = incomeEditModal.querySelector('#income-edit-form');
        const action = button.getAttribute('data-action');
        
        if (action == 'update') {
            
            const modalTitle = incomeEditModal.querySelector('.modal-title');
            modalTitle.innerHTML = "Edycja przychodu";

            fillTheIncomeForm(form, button);

        } else {

            const modalTitle = incomeEditModal.querySelector('.modal-title');
            modalTitle.innerHTML = "Dodawanie nowego przychodu";
            
            form.clearAllFields();

            form.querySelector("#income-edit-date").value = new Date().toISOString().slice(0, 10);

            button.classList.add("active");

        }

        form.action = "/incomes/" + action;

    })
    
};

incomeEditModal.addEventListener('shown.bs.modal', () => {
    document.querySelector('#income-edit-amount').focus();
})
incomeEditModal.addEventListener('hidden.bs.modal', () => {
    document.querySelector('#add-income-button').classList.remove('active');
});

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

/**
 * Fills the transaction form with data from the provided button's dataset.
 * @param {HTMLButtonElement} button - The button element containing the dataset with transaction information.
 */
function fillTheIncomeForm(form, button) {
    const { id, amount, date, category, comment } = button.dataset;

    const dateInput = form.querySelector("#income-edit-date");
    dateInput.value = date;

    const idInput = form.querySelector("#income-edit-id");
    idInput.value = id;

    const categorySelect = form.querySelector("#income-edit-category");
    categorySelect.value = category;


    const commentTexarea = form.querySelector("#income-edit-comment");
    commentTexarea.innerText = comment;

    const amountInput = form.querySelector('#income-edit-amount');
    amountInput.value = amount.replace(/\./g, ',');

}