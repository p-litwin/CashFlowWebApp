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
        if (typeof (this.budget) =='number' && typeof(this.total) == 'number') {
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
            let selectedDate = new Date(date);
            let selectedMonth = selectedDate.getMonth() + 1;
            let selectedYear = selectedDate.getUTCFullYear();
            let totalBeforeNewExpense = await getCategoryTotalExpensesForSelectedMonth(Number(category), selectedYear, selectedMonth);
            let budgetForCategory = await getCategoryBudget(category);
            const budgetWidget = new BudgetWidget(totalBeforeNewExpense, budgetForCategory);
            newTotalElement.innerText = budgetWidget.total;
            categoryBudget.innerText = budgetWidget.budget;
            categoryRemainingElement.innerText = budgetWidget.remaining;
        } else {
            const today = new Date();
            let day = today.getDate();
            let month = today.getMonth() + 1;
            let year = today.getFullYear();
            date = `${year}-${month}-${day}`;
            newTotalElement.innerText = modalAmountInput.value;
            categoryBudget.innerText = '-';
            categoryRemainingElement.innerText = '-';
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
    })
    expensesEditModal.addEventListener('shown.bs.modal', event => {
        modalAmountInput.focus();
    })
    expensesEditModal.addEventListener('hide.bs.modal', (event) => {
        document.querySelector("#add-expense-button").classList.remove("active");
    })
};

const expenseAmountInput = document.getElementById('expense-edit-amount');
expenseAmountInput.addEventListener('input', async (e) => {
    const categoryElemnet = document.getElementById('expense-edit-category');
    const expenseCategory = categoryElemnet.value;
    if (!expenseCategory) {
        const newTotalElement = document.getElementById('new-total');
        newTotalElement.innerText = Number(expenseAmountInput.value);
    } else {
        const expenseDateInput = document.getElementById('expense-edit-date');
        const selectedDate = new Date(expenseDateInput.value);
        const selectedMonth = selectedDate.getMonth() + 1;
        const selectedYear = selectedDate.getUTCFullYear();
        const newTotalElement = document.getElementById('new-total');
        const categoryBudget = document.getElementById('category-budget');
        const categoryRemainingElement = document.getElementById('category-remaining');
        const totalBeforeNewExpense = await getCategoryTotalExpensesForSelectedMonth(expenseCategory, selectedYear, selectedMonth);
        const totalAfterNewExpense = totalBeforeNewExpense + Number(expenseAmountInput.value);
        const budgetForCategory = await getCategoryBudget(expenseCategory);
        const budgetWidget = new BudgetWidget(totalAfterNewExpense, budgetForCategory);
        newTotalElement.innerText = budgetWidget.total;
        categoryBudget.innerText = budgetWidget.budget;
        categoryRemainingElement.innerText = budgetWidget.remaining;
    }

});

const expenseCategoryInput = document.getElementById('expense-edit-category');
expenseCategoryInput.addEventListener('change', async (e) => {
    const newTotalElement = document.getElementById('new-total');
    const categoryBudgetElement = document.getElementById('category-budget');
    const categoryRemainingElement = document.getElementById('category-remaining');
    const categoryElement = document.getElementById('expense-edit-category');
    const expenseCategory = categoryElement.value;
    if (!expenseCategory) {
        newTotalElement.innerText = Number(expenseAmountInput.value);
        categoryBudgetElement.innerText = '-';
        categoryRemainingElement.innerText = '-';
    } else {
        const expenseDateInput = document.getElementById('expense-edit-date');
        const selectedDate = new Date(expenseDateInput.value);
        const selectedMonth = selectedDate.getMonth() + 1;
        const selectedYear = selectedDate.getUTCFullYear();
        // tu muszę pobrać dane z bazy danych
        const totalBeforeNewExpense = await getCategoryTotalExpensesForSelectedMonth(expenseCategory, selectedYear, selectedMonth);
        const totalAfterNewExpense = totalBeforeNewExpense + Number(expenseAmountInput.value);
        //tu muszę pobrać dane z bazy danych
        const budgetForCategory = await getCategoryBudget(expenseCategory);
        const budgetWidget = new BudgetWidget(totalAfterNewExpense, budgetForCategory);
        newTotalElement.innerText = budgetWidget.total;
        categoryBudgetElement.innerText = budgetWidget.budget;
        categoryRemainingElement.innerText = budgetWidget.remaining;
    }

});

$("#expense-edit-date").on('apply.daterangepicker', async event => {
    const newTotalElement = document.getElementById('new-total');
    const categoryBudgetElement = document.getElementById('category-budget');
    const categoryRemainingElement = document.getElementById('category-remaining');
    const categoryElement = document.getElementById('expense-edit-category');
    const expenseCategory = categoryElement.value;
    if (!expenseCategory) {
        newTotalElement.innerText = Number(expenseAmountInput.value);
        categoryBudgetElement.innerText = '-';
        categoryRemainingElement.innerText = '-';
    } else {
        const expenseDateInput = document.getElementById('expense-edit-date');
        const selectedDate = new Date(expenseDateInput.value);
        const selectedMonth = selectedDate.getMonth() + 1;
        const selectedYear = selectedDate.getUTCFullYear();
        const totalBeforeNewExpense = await getCategoryTotalExpensesForSelectedMonth(expenseCategory, selectedYear, selectedMonth);
        const totalAfterNewExpense = totalBeforeNewExpense + Number(expenseAmountInput.value);
        const budgetForCategory = await getCategoryBudget(expenseCategory);
        const budgetWidget = new BudgetWidget(totalAfterNewExpense, budgetForCategory);
        newTotalElement.innerText = budgetWidget.total;
        categoryBudgetElement.innerText = budgetWidget.budget;
        categoryRemainingElement.innerText = budgetWidget.remaining;
    }
});

document.querySelector("#expense-edit-date").addEventListener('blur', async event => {
    const newTotalElement = document.getElementById('new-total');
    const categoryBudgetElement = document.getElementById('category-budget');
    const categoryRemainingElement = document.getElementById('category-remaining');
    const categoryElement = document.getElementById('expense-edit-category');
    const expenseCategory = categoryElement.value;
    if (!expenseCategory) {
        newTotalElement.innerText = Number(expenseAmountInput.value);
        categoryBudgetElement.innerText = '-';
        categoryRemainingElement.innerText = '-';
    } else {
        const expenseDateInput = document.getElementById('expense-edit-date');
        const selectedDate = new Date(expenseDateInput.value);
        const selectedMonth = selectedDate.getMonth() + 1;
        const selectedYear = selectedDate.getUTCFullYear();
        // tu muszę pobrać dane z bazy danych
        const totalBeforeNewExpense = await getCategoryTotalExpensesForSelectedMonth(expenseCategory, selectedYear, selectedMonth);
        const totalAfterNewExpense = totalBeforeNewExpense + Number(expenseAmountInput.value);
        //tu muszę pobrać dane z bazy danych
        const budgetForCategory = await getCategoryBudget(expenseCategory);
        const budgetWidget = new BudgetWidget(totalAfterNewExpense, budgetForCategory);
        newTotalElement.innerText = budgetWidget.total;
        categoryBudgetElement.innerText = budgetWidget.budget;
        categoryRemainingElement.innerText = budgetWidget.remaining;
    }
});

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