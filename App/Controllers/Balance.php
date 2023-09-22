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
        
        $month_to_date = date('Y') . "-" . date('m') . "-01" . " - " . date('Y') . "-" . date('m') . "-" . date('d');

        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $balance_time_frame = $_POST['balance-time-frame'];
        } else {
            $balance_time_frame = $month_to_date ;
        }

        $balance_time_frame_start = substr($balance_time_frame,0,10);
        $balance_time_frame_end = substr($balance_time_frame, 13, 10);

        $expenses = Expense::getAllExpensesForGivenPeriod($balance_time_frame_start, $balance_time_frame_end);
        $total_expense =  Expense::getTotalExpensesForGivenPeriod($balance_time_frame_start, $balance_time_frame_end);
        $incomes = Income::getAllIncomesForGivenPeriod($balance_time_frame_start, $balance_time_frame_end);
        $total_income = Income::getTotalIncomesForGivenPeriod($balance_time_frame_start, $balance_time_frame_end);
        
        $balance = bcsub($total_income[0],$total_expense[0],2);
        View::renderTemplate('\Balance\show.html', [
            'expenses' => $expenses,
            'total_expense' => bcadd($total_expense[0],0,2),
            'incomes' => $incomes,
            'total_income' => bcadd($total_income[0],0,2),
            'balance' => $balance,
            'balance_time_frame' => $balance_time_frame]);

    }

}

?>