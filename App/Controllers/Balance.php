<?php

namespace App\Controllers;

use Core\View;
use App\Models\Expense;
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
        View::renderTemplate('\Balance\show.html', [
            'expenses' => $expenses,
            'total_expenses' => $total_expenses]);
    }

}

?>