<?php

namespace App\Controllers;

use Core\View;
use App\Models\Expense;
use App\Models\Income;
/**
 * Display balance of expenses and incomes
 */
class Balance extends \App\Controllers\Authenticated {

    /**
     * Summary of showAction
     * @return void
     */
    public function showAction() {
        $expenses = Expense::getAllExpensesForGivenPeriod("2023-09-01", "2023-09-30");
        $total_expenses =  Expense::getTotalExpensesForGivenPeriod("2023-09-01", "2023-09-30");
        $incomes = Income::getAllIncomesForGivenPeriod("2023-09-01", "2023-09-30");
        $total_incomes = Income::getTotalIncomesForGivenPeriod("2023-09-01", "2023-09-30");
        View::renderTemplate('\Balance\show.html', [
            'expenses' => $expenses,
            'total_expenses' => $total_expenses,
            'incomes' => $incomes,
            'total_incomes' => $total_incomes]);
    }

}

?>