<?php

namespace App\Controllers;

use Core\View;
use App\Models\Transactions;

/**
 * Get the data of expenses and incomes from the database, make the calculations and pass them to the Balance View
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

        $expenses = Transactions::getAllExpensesForGivenPeriod($balance_time_frame_start, $balance_time_frame_end);
        $total_expense =  Transactions::getTotalExpensesForGivenPeriod($balance_time_frame_start, $balance_time_frame_end);
        $incomes = Transactions::getAllIncomesForGivenPeriod($balance_time_frame_start, $balance_time_frame_end);
        $total_income = Transactions::getTotalIncomesForGivenPeriod($balance_time_frame_start, $balance_time_frame_end);
        $balance = $total_income[0] - $total_expense[0];
        
        $total_income = number_format($total_income[0], 2, ".", " ");
        $total_expense = number_format($total_expense[0], 2, ".", " ");
        $balance = number_format($balance, 2, ".", " ");
        
        View::renderTemplate('\Balance\show.html', [
            'expenses' => $expenses,
            'total_expense' => $total_expense,
            'incomes' => $incomes,
            'total_income' => $total_income,
            'balance' => $balance,
            'balance_time_frame' => $balance_time_frame]);

    }

}

?>