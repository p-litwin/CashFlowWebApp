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

/**
 * Represents a budget widget that calculates the remaining budget based on the total
 * expenses for selected category and budget values.
 */
class BudgetWidget {
    /**
     * Represents the total value of expenses.
     * @type {number}
     */
    total;
    
    /**
     * Represents the budget for expense category
     * @type {number}
     */
    budget;
    
    /**
     * Represents the remaining amount.
     * @type {number}
     */
    remaining;
    /**
     * Represents a ExpenseForm object.
     * @constructor
     * @param {number} total - The total expense.
     * @param {number} budget - The budget amount.
     */
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
    
    /**
     * Calculates the remaining budget by subtracting the total expenses from the budget.
     * @returns {Promise<void>}
     */
    async calculateRemaining() {
        this.remaining = this.budget - this.total;
    }

}

const expensesEditModal = document.getElementById('expense-edit-modal')
if (expensesEditModal) {
    expensesEditModal.addEventListener('show.bs.modal', async event => {
        // Button that triggered the modal
        const button = event.relatedTarget;
        // Extract info from data-bs-* attributes
        
        const form = expensesEditModal.querySelector("#expense-edit-form");
        const action = button.getAttribute('data-action');
        
        if (action == 'update') {
            
            const modalTitle = expensesEditModal.querySelector('.modal-title');
            modalTitle.innerHTML = 'Edycja wydatku';
           
            fillTheTransactionForm(form, button);

        } else {

            const modalTitle = expensesEditModal.querySelector('.modal-title');
            modalTitle.innerHTML = 'Dodawanie nowego wydatku';

            form.clearAllFields();

            button.classList.add("active");

        }

        form.action = "/expenses/" + action;
        await refreshBudgetWidget();

    });
};

expensesEditModal.addEventListener('shown.bs.modal', () => {
    document.querySelector('#expense-edit-amount').focus();
});

document.getElementById('expense-edit-amount').addEventListener('input', refreshBudgetWidget);

document.getElementById('expense-edit-category').addEventListener('change', refreshBudgetWidget);

document.querySelector("#expense-edit-date").addEventListener('blur', refreshBudgetWidget);

$("#expense-edit-date").on('apply.daterangepicker', refreshBudgetWidget);

$('.transaction-form-button').on('click', () => {
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
    const expenseAmountInput = document.getElementById('expense-edit-amount');
    const newTotalElement = document.getElementById('new-total');
    const categoryBudgetElement = document.getElementById('category-budget');
    const categoryRemainingElement = document.getElementById('category-remaining');
    const categoryElement = document.getElementById('expense-edit-category');
    const expenseCategory = categoryElement.value;
    const expenseIdElement = document.getElementById('expense-edit-id');
    const expenseId = expenseIdElement.value;
    if (!expenseCategory) {
        newTotalElement.innerText = Number(expenseAmountInput.value).toFixed(2).replace(/\./g, ',');
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
        newTotalElement.innerText = budgetWidget.total.replace(/\./g, ',');
        if (budgetWidget.budget == 0) {
            categoryBudgetElement.innerText = '-';
            categoryRemainingElement.innerText = '-';
        } else {
            categoryBudgetElement.innerText = budgetWidget.budget.replace(/\./g, ',');
            styleBudgetFields(budgetWidget.remaining);
            categoryRemainingElement.innerText = budgetWidget.remaining.replace(/\./g, ',');
        }
        updateBudgetWidgetHeader();
    }

}

function updateBudgetWidgetHeader() {
    const monthMap = {
        1: 'styczeń',
        2: 'luty',
        3: 'marzec',
        4: 'kwiecień',
        5: 'maj',
        6: 'czerwiec',
        7: 'lipiec',
        8: 'sierpień',
        9: 'wrzesień',
        10: 'październik',
        11: 'listopad',
        12: 'grudzień'
    };
    const expenseDateInput = document.getElementById('expense-edit-date');
    const selectedDate = new Date(expenseDateInput.value);
    const selectedMonth = selectedDate.getMonth() + 1;
    const selectedYear = selectedDate.getUTCFullYear();
    const selectedMonthName = monthMap[selectedMonth];
    document.querySelector("#budget-date").innerText = selectedMonthName + ' ' + selectedYear;
}

/**
 * Get the total expenses for the expense category in selected month and year. 
 * @param {number} categoryId - Id of the expenses category 
 * @param {number} year - Full four digit year of the expense
 * @param {number} month - Month of the expense
 * @param {number} ignoreExpenseId - Id of the expense that should be ignored in the total calculation
 * @returns {number} - Total expenses for selected month. 2 decimal places
 */
async function getCategoryTotalExpensesForSelectedMonth(categoryId, year, month, ignoreExpenseId = null) {
    try {
        const total = await fetch(`/expenses/category-total-expenses-for-selected-month?id=${categoryId}&year=${year}&month=${month}&ignore_expense_id=${ignoreExpenseId}`);
        const result = await total.json();
        return Number(result.Total);
    } catch (error) {
        console.error(error);
        return 0;
    }
}

/**
 * Get the budget for selected category
 * @param {number} categoryId - Id of the expenses category
 * @returns {number} - Budget for selected category. 2 decimal  places
 */
async function getCategoryBudget(categoryId) {
    try {
        const response = await fetch(`/expense-categories/category-budget?id=${categoryId}`);
        const budget = await response.json();
        return Number(budget.budget);
    } catch (error) {
        console.error(error);
        return 0;
    }
}

expensesEditModal.addEventListener('hidden.bs.modal', () => {
    document.querySelector('#add-expense-button').classList.remove('active');
});


/**
 * Change text color of the remaining value and total expense to red and header text to "Przekroczono o:"
 * if total expense is greater than the budget
 * If it's less than the budget, change the text color to green and the header text to "Pozostało:"
 * 
 * @param {number} remaining - The remaining value.
 */
function styleBudgetFields(remaining) {
    const totalFieldParent = document.getElementById('new-total').parentElement;
    const remainingFieldParent = document.getElementById('category-remaining').parentElement;
    const remainingFieldHeader = document.getElementById('category-remaining-header');
    if (remaining < 0) {
        remainingFieldParent.classList.add('text-danger');
        remainingFieldParent.classList.remove('text-success');
        remainingFieldHeader.innerText = "Przekroczono o:"
        totalFieldParent.classList.add('text-danger');
        totalFieldParent.classList.remove('text-success');
    } else {
        remainingFieldHeader.innerText = "Pozostało:"
        remainingFieldParent.classList.remove('text-danger');
        remainingFieldParent.classList.add('text-success');
        totalFieldParent.classList.remove('text-danger');
        totalFieldParent.classList.add('text-success');
    }
}

/**
 * Fills the transaction form with data from the provided button's dataset.
 * @param {HTMLButtonElement} button - The button element containing the dataset with transaction information.
 */
function fillTheTransactionForm(form, button) {
    const { id, amount, date, category, payment, comment } = button.dataset;
            
    const dateInput = form.querySelector("#expense-edit-date");
    dateInput.value = date;

    const idInput = form.querySelector("#expense-edit-id");
    idInput.value = id;

    const categorySelect = form.querySelector("#expense-edit-category");
    categorySelect.value = category;

    const paymentSelect = form.querySelector("#expense-edit-method");
    paymentSelect.value = payment;

    const commentTexarea = form.querySelector("#expense-edit-comment");
    commentTexarea.innerText = comment;

    const amountInput = form.querySelector('#expense-edit-amount');
    amountInput.value = amount.replace(/\./g, ',');

}