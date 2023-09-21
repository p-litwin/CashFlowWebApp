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
        $total_expense =  Expense::getTotalExpensesForGivenPeriod("2023-09-01", "2023-09-30");
        $incomes = Income::getAllIncomesForGivenPeriod("2023-09-01", "2023-09-30");
        $total_income = Income::getTotalIncomesForGivenPeriod("2023-09-01", "2023-09-30");
        $balance = $total_income[0] - $total_expense[0];
        View::renderTemplate('\Balance\show.html', [
            'expenses' => $expenses,
            'total_expense' => $total_expense[0],
            'incomes' => $incomes,
            'total_income' => $total_income[0],
            'balance' => round($balance,2)]);
    }

}

?>