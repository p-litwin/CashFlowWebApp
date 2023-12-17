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

            form.querySelector("#expense-edit-date").value = new Date().toISOString().slice(0, 10);

            button.classList.add("active");

        }

        form.action = "/expenses/" + action;
        await refreshBudgetTiles();

    });
};

expensesEditModal.addEventListener('shown.bs.modal', () => {
    document.querySelector('#expense-edit-amount').focus();
});

document.getElementById('expense-edit-amount').addEventListener('input', refreshBudgetTiles);

document.getElementById('expense-edit-category').addEventListener('change', refreshBudgetTiles);

document.querySelector("#expense-edit-date").addEventListener('blur', refreshBudgetTiles);

expensesEditModal.addEventListener('hidden.bs.modal', () => {
    document.querySelector('#add-expense-button').classList.remove('active');
});

$("#expense-edit-date").on('apply.daterangepicker', refreshBudgetTiles);

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

/**
 * Refreshes the budget tiles based on the expense form inputs.
 * 
 * @returns {Promise<void>} A promise that resolves when the budget tiles are updated.
 */
async function refreshBudgetTiles() {

    const expenseAmountInput = document.getElementById('expense-edit-amount');
    const categoryElement = document.getElementById('expense-edit-category');
    const expenseCategory = categoryElement.value;
    const expenseDateInput = document.getElementById('expense-edit-date');
    const selectedDate = new Date(expenseDateInput.value);

    if (!expenseCategory) {

        updateBudgetUIElements(expenseAmountInput.value, 0, 0, selectedDate);

    } else {

        const expenseIdElement = document.getElementById('expense-edit-id');
        const expenseId = expenseIdElement.value;

        const totalBeforeNewExpense = await calculateTotalBeforeNewExpense(expenseCategory, selectedDate, expenseId);
        const totalAfterNewExpense = calculateNewTotal(totalBeforeNewExpense, expenseAmountInput.value);
        const budgetForCategory = await getCategoryBudget(expenseCategory);
        const remainingBudget = calculateRemainingBudget(totalAfterNewExpense, budgetForCategory);
        updateBudgetUIElements(totalAfterNewExpense, budgetForCategory, remainingBudget, selectedDate);

    }

}


/**
 * Calculates the total expenses for a given expense category in a selected month and year,
 * excluding the expense with the specified expenseId.
 *
 * @param {string} expenseCategory - The category of the expense.
 * @param {Date} selectedDate - The selected date.
 * @param {string} expenseId - The ID of the expense to exclude from the calculation.
 * @returns {Promise<number>} - The total expenses for the given expense category in the selected month and year.
 */
async function calculateTotalBeforeNewExpense(expenseCategory, selectedDate, expenseId) {
    const selectedMonth = selectedDate.getMonth() + 1;
    const selectedYear = selectedDate.getUTCFullYear();
    return await getCategoryTotalExpensesForSelectedMonth(expenseCategory, selectedYear, selectedMonth, expenseId);
}

/**
 * Calculates the remaining budget after deducting the total after a new expense from the category budget.
 * @param {number} totalAfterNewExpense - The total amount after deducting the new expense.
 * @param {number} categoryBudget - The budget allocated for the category.
 * @returns {number} - The remaining budget after deducting the total after a new expense.
 * @throws {Error} - If the input is not a valid number.
 */
function calculateRemainingBudget(totalAfterNewExpense, categoryBudget) {
    if (isNaN(totalAfterNewExpense) || isNaN(categoryBudget)) {
        throw new Error('Invalid input. Please provide valid numbers.');
    }
    return Number(categoryBudget) - Number(totalAfterNewExpense);
}

/**
 * Calculates the new total by adding the expense amount to the total before the new expense.
 * @param {number} totalBeforeNewExpense - The total before the new expense.
 * @param {number} expenseAmount - The amount of the new expense.
 * @returns {number} - The new total after adding the expense amount.
 * @throws {Error} - If either totalBeforeNewExpense or expenseAmount is not a valid number.
 */
function calculateNewTotal(totalBeforeNewExpense, expenseAmount) {
    if (isNaN(totalBeforeNewExpense) || isNaN(expenseAmount)) {
        throw new Error('Invalid input. Please provide valid numbers.');
    }
    return Number(totalBeforeNewExpense) + Number(expenseAmount);
}

/**
 * Updates the UI elements related to the budget.
 * 
 * @param {number} totalAfterNewExpense - The total amount after adding a new expense.
 * @param {number} categoryBudget - The budget allocated for the category.
 * @param {number} remainingBudget - The remaining budget for the category.
 * @param {string} selectedDate - The selected date for the budget.
 */
function updateBudgetUIElements(totalAfterNewExpense, categoryBudget, remainingBudget, selectedDate) {
    const newTotalElement = document.getElementById('new-total');
    newTotalElement.innerText = convertToFloatWithComma(totalAfterNewExpense);

    const categoryBudgetElement = document.getElementById('category-budget');
    const categoryRemainingElement = document.getElementById('category-remaining');
    
    if (categoryBudget == 0) {
        categoryBudgetElement.innerText = '-';
        categoryRemainingElement.innerText = '-';
        updateBudgetFieldsStyleAndCaption(0);
    } else {
        categoryBudgetElement.innerText = convertToFloatWithComma(categoryBudget);
        categoryRemainingElement.innerText = convertToFloatWithComma(remainingBudget);
        updateBudgetFieldsStyleAndCaption(remainingBudget);
    }

    updateBudgetWidgetDateCaption(selectedDate);
}

/**
 * Updates the budget widget date caption with the selected date.
 * 
 * @param {Date} selectedDate - The selected date.
 * @returns {void}
 */
function updateBudgetWidgetDateCaption(selectedDate) {
    const selectedMonth = selectedDate.getMonth() + 1;
    const selectedYear = selectedDate.getUTCFullYear();
    const selectedMonthName = MONTH_NAMES[selectedMonth];
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

/**
 * Change text color of the remaining value and total expense to red and header text to "Przekroczono o:"
 * if total expense is greater than the budget. 
 * If it's less than the budget, change the text color to green and the header text to "Pozostało:"
 * 
 * @param {number} remaining - The remaining value.
 */
function updateBudgetFieldsStyleAndCaption(remaining) {
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