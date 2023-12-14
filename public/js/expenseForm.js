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
 * Represents a budget widget that calculates the remaining budget based on the total and budget values.
 */
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
    expensesEditModal.addEventListener('show.bs.modal', async event => {
        const modalAmountInput = expensesEditModal.querySelector('#expense-edit-amount');
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
            const modalTitle = expensesEditModal.querySelector('.modal-title');
            modalTitle.innerHTML = 'Edycja wydatku';
        } else {
            const modalTitle = expensesEditModal.querySelector('.modal-title');
            modalTitle.innerHTML = 'Dodawanie nowego wydatku';
            document.querySelector("#add-expense-button").classList.add("active");
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
};

expensesEditModal.addEventListener('shown.bs.modal', event => {
    document.querySelector('#expense-edit-amount').focus();
});

document.getElementById('expense-edit-amount').addEventListener('input', refreshBudgetWidget);

document.getElementById('expense-edit-category').addEventListener('change', refreshBudgetWidget);

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
    const expenseAmountInput = document.getElementById('expense-edit-amount');
    const newTotalElement = document.getElementById('new-total');
    const categoryBudgetElement = document.getElementById('category-budget');
    const categoryRemainingElement = document.getElementById('category-remaining');
    const categoryElement = document.getElementById('expense-edit-category');
    const expenseCategory = categoryElement.value;
    const expenseIdElement = document.getElementById('expense-edit-id');
    const expenseId = expenseIdElement.value;
    if (!expenseCategory) {
        newTotalElement.innerText = Number(expenseAmountInput.value).toFixed(2);
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
    document.querySelector("#budget-date").innerText = selectedMonthName +  ' ' + selectedYear;
    console.log(selectedMonthName +  ' ' + selectedYear);
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

expensesEditModal.addEventListener('hide.bs.modal', event => {
    document.querySelector('#add-expense-button').classList.remove('active');
});