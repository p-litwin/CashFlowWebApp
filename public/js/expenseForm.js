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

class BudgetWidget {
    total;
    budget;
    remaining;
    constructor(total, budget) {
        this.total = parseFloat(total);
        this.budget = parseFloat(budget);
        if (typeof (this.budget) === 'number' && typeof (this.total) === 'number') {
            this.calculateRemaining();
            this.total = this.total.toFixed(2);
            this.budget = this.budget.toFixed(2);
            this.remaining = this.remaining.toFixed(2);
        }
    }
    async calculateRemaining() {
        this.remaining = this.budget - this.total;
    }

}

const expensesEditModal = document.getElementById('expense-edit-modal')
if (expensesEditModal) {
    const modalAmountInput = expensesEditModal.querySelector('#expense-edit-amount');
    const modalTitle = expensesEditModal.querySelector('.modal-title');
    expensesEditModal.addEventListener('show.bs.modal', async event => {
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
        const newTotalElement = document.getElementById('new-total');
        const categoryBudget = document.getElementById('category-budget');
        const categoryRemainingElement = document.getElementById('category-remaining');
        if (action == 'update') {
            id = button.getAttribute('data-bs-id');
            amount = button.getAttribute('data-bs-amount');
            date = button.getAttribute('data-bs-date');
            category = button.getAttribute('data-bs-category');
            payment = button.getAttribute('data-bs-payment');
            comment = button.getAttribute('data-bs-comment');
            modalTitle.innerHTML = 'Edycja wydatku';
        } else {
            modalTitle.innerHTML = 'Dodawanie nowego wydatku';
            $("#add-expense-button").addClass("active");
        }
        const idInput = document.getElementById("expense-edit-id");
        idInput.value = id;
        const dateInput = document.getElementById("expense-edit-date");
        dateInput.value = date;
        const categorySelect = document.getElementById("expense-edit-category");
        categorySelect.value = category;
        const paymentSelect = document.getElementById("expense-edit-method");
        paymentSelect.value = payment;
        const commentTexarea = document.getElementById("expense-edit-comment");
        commentTexarea.textContent = comment;
        modalAmountInput.value = amount;
        const form = document.getElementById("expense-edit-form");
        form.action = "/expenses/" + action;
        await refreshBudgetWidget();
    });
    expensesEditModal.addEventListener('shown.bs.modal', event => {
        modalAmountInput.focus();
    });
    expensesEditModal.addEventListener('hide.bs.modal', (event) => {
        document.querySelector("#add-expense-button").classList.remove("active");
    });
};

const expenseAmountInput = document.getElementById('expense-edit-amount');
expenseAmountInput.addEventListener('input', refreshBudgetWidget);

const expenseCategoryInput = document.getElementById('expense-edit-category');
expenseCategoryInput.addEventListener('change', refreshBudgetWidget);



document.querySelector("#expense-edit-date").addEventListener('blur', refreshBudgetWidget);

$("#expense-edit-date").on('apply.daterangepicker', refreshBudgetWidget);

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

async function refreshBudgetWidget() {
    const newTotalElement = document.getElementById('new-total');
    const categoryBudgetElement = document.getElementById('category-budget');
    const categoryRemainingElement = document.getElementById('category-remaining');
    const categoryElement = document.getElementById('expense-edit-category');
    const expenseCategory = categoryElement.value;
    const expenseIdElement = document.getElementById('expense-edit-id');
    const expenseId = expenseIdElement.value;
    if (!expenseCategory) {
        newTotalElement.innerText = Number(expenseAmountInput.value);
        categoryBudgetElement.innerText = '-';
        categoryRemainingElement.innerText = '-';
    } else {
        const expenseDateInput = document.getElementById('expense-edit-date');
        const selectedDate = new Date(expenseDateInput.value);
        const selectedMonth = selectedDate.getMonth() + 1;
        const selectedYear = selectedDate.getUTCFullYear();
        const totalBeforeNewExpense = await getCategoryTotalExpensesForSelectedMonth(expenseCategory, selectedYear, selectedMonth, expenseId);
        const totalAfterNewExpense = totalBeforeNewExpense + Number(expenseAmountInput.value);
        const budgetForCategory = await getCategoryBudget(expenseCategory);
        const budgetWidget = new BudgetWidget(totalAfterNewExpense, budgetForCategory);
        newTotalElement.innerText = budgetWidget.total;
        if (budgetWidget.budget == 0) {
            categoryBudgetElement.innerText = '-';
            categoryRemainingElement.innerText = '-';
        } else {
            categoryBudgetElement.innerText = budgetWidget.budget;
            categoryRemainingElement.innerText = budgetWidget.remaining;
        }
    }
}

/**
 * Get the total expenses for the expense category in selected month and year. 
 * @param {number} categoryId - Id of the expenses category 
 * @param {number} year - Full four digit year of the expense
 * @param {number} month - Month of the expense
 * @returns {number} - Total expenses for selected month. 2 decimal places
 */
async function getCategoryTotalExpensesForSelectedMonth(categoryId, year, month, ignoreExpenseId = null) {
    const total = await fetch(`expenses/category-total-expenses-for-selected-month?id=${categoryId}&year=${year}&month=${month}&ignore_expense_id=${ignoreExpenseId}`);
    const result = await total.json();
    return Number(result.Total);
}

/**
 * Get the budget for selected category
 * @param {number} categoryId - Id of the expenses category
 * @returns {number} - Budget for selected category. 2 decimal  places
 */
async function getCategoryBudget(categoryId) {
    const response = await fetch(`expense-categories/category-budget?id=${categoryId}`);
    const budget = await response.json();
    return Number(budget.budget);
}