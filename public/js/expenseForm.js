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
            updateBudgetInfo(0, )
        } else {
            const today = new Date();
            let day = today.getDate();
            let month = today.getMonth() + 1;
            let year = today.getFullYear();
            date = `${year}-${month}-${day}`;
            modalTitle.innerHTML = 'Dodawanie nowego wydatku';
            $("#add-expense-button").addClass("active");
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
    expensesEditModal.addEventListener('hide.bs.modal', event => {
        $("#add-expense-button").removeClass("active");
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



document.querySelector("#expense-edit-category").addEventListener('change', async event => {
    const categoryId = event.target.value;
    const dateElement = document.querySelector("#expense-edit-date");
    let selectedDate = new Date(dateElement.value);
    let selectedMonth = selectedDate.getMonth() + 1;
    let selectedYear = selectedDate.getUTCFullYear();
    let totalExpense = await getCategoryTotalExpensesForSelectedMonth(categoryId, selectedYear, selectedMonth);
    const budgetForCategory = await getCategoryBudget(categoryId);
    let newExpense = document.querySelector("#expense-edit-amount").value;
    updateBudgetInfo(newExpense, totalExpense, budgetForCategory);
    
    document.querySelector("#expense-edit-amount").addEventListener('input', async event => {
        updateBudgetInfo(event.target.value, totalExpense, budgetForCategory);
    });

    document.querySelector("#expense-edit-date").addEventListener('input', async event => {
        newExpense = document.querySelector("#expense-edit-amount").value;
        selectedDate = new Date(event.target.value);
        let selectedMonth = selectedDate.getMonth() + 1;
        let selectedYear = selectedDate.getUTCFullYear();
        totalExpense = await getCategoryTotalExpensesForSelectedMonth(categoryId, selectedYear, selectedMonth);
        console.log(totalExpense);
        updateBudgetInfo(newExpense, totalExpense, budgetForCategory);
    });

    $("#expense-edit-date").on('apply.daterangepicker', async event => {
        newExpense = document.querySelector("#expense-edit-amount").value;
        selectedDate = new Date(event.target.value);
        let selectedMonth = selectedDate.getMonth() + 1;
        let selectedYear = selectedDate.getUTCFullYear();
        totalExpense = await getCategoryTotalExpensesForSelectedMonth(categoryId, selectedYear, selectedMonth);
        console.log(totalExpense);
        updateBudgetInfo(newExpense, totalExpense, budgetForCategory);
    });

});
/**
 * Update the budget fields in Expense Form
 * 
 * @param {number} newExpense - value of the new expense. 2 decimal places.
 * @param {number} previousTotal - Total expenses prior adding the new expense. 2 decimal places.
 * @param {number} budget - Budget to calculate the remaining amount after adding new expense. 2 decimal places.
 */
async function updateBudgetInfo(newExpense = 0, previousTotal, budget) {
    const newTotalElement = document.querySelector("#new-total");
    const budgetElement = document.querySelector("#category-budget");
    const remainingElement = document.querySelector("#category-remaining");
    let newTotal = calculateNewTotal(newExpense, previousTotal);
    newTotalElement.textContent = newTotal;
    if (budget != null) {
        remainingElement.textContent = calculateRemaining(newTotal, budget);
        budgetElement.textContent = budget;
    } else {
        remainingElement.textContent = '-';
        budgetElement.textContent = '-';
    }
}

/**
 * Calculate new total amount
 * @param {number} newAmount New expense amount
 * @param {number} total Total expenses without new expense amount
 * @returns {number} New total  after adding new expense
 */
function calculateNewTotal(newAmount, total) {
    newTotal = Number(total)+Number(newAmount);
    newTotal = newTotal.toFixed(2);
    return newTotal;       
}

/**
 * 
 * @param {number} newTotal New total amount after adding new Expense 
 * @param {number} budget Budget for the selected category
 * @returns {number} Budget left after adding new expense
 */
function calculateRemaining(newTotal, budget){
    remaining = Number(budget) - Number(newTotal);
    remaining = remaining.toFixed(2);
    return remaining;
}

/**
 * Get the total expenses for the expense category in selected month and year. 
 * @param {number} categoryId - Id of the expenses category 
 * @param {number} year - Full four digit year of the expense
 * @param {number} month - Month of the expense
 * @returns {number} - Total expenses for selected month. 2 decimal places
 */
async function getCategoryTotalExpensesForSelectedMonth(categoryId, year, month) {
    const total = await fetch(`expenses/category-total-expenses-for-selected-month?id=${categoryId}&year=${year}&month=${month}`);
    const result = await total.json();
    return result.Total;
}

/**
 * Get the budget for selected category
 * @param {number} categoryId - Id of the expenses category
 * @returns {number} - Budget for selected category. 2 decimal  places
 */
async function getCategoryBudget(categoryId) {
    const response = await fetch(`expense-categories/category-budget?id=${categoryId}`);
    const budget = await response.json();
    return budget.budget;
}

