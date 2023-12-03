<?php

namespace App\Controllers;

use App\Flash;
use App\Models\PaymentMethod;
use App\Models\Transactions;
use Core\View;
use App\Models\ExpenseCategory;
use App\Models\Expense;

/**
 * Expense controller
 */
class Expenses extends \App\Controllers\Authenticated
{
    /**
     * Add new expense
     * @return void
     */
    public function addAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $expense = new Expense($_POST);
            $expense->user_id = $this->user_id;
            if ($expense->save()) {
                Flash::addMessage('Wydatek został dodany');
            } else {
                foreach ($expense->errors as $error) {
                    Flash::addMessage($error, Flash::WARNING);
                }
            }
            $this->redirect($_SESSION['return_to']);
        }
        Flash::addMessage('Dane nowego wydatku nie zostały podane', Flash::WARNING);
        $this->redirect($_SESSION['return_to']);

    }

    public function updateAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $expense = new Expense($_POST);
            $expense->user_id = $this->user_id;
        }

        if ($expense->update()) {
            Flash::addMessage('Wydatek został zaktualizowany');
            if (isset($_SESSION['return_to'])) {
                $this->redirect($_SESSION['return_to']);
            } else {
                $this->redirect('/transactions-list/show');
            }
        } else {
            Flash::addMessage('Wydatek nie został zaktualizowany', Flash::WARNING);
            if (isset($_SESSION['return_to'])) {
                $this->redirect($_SESSION['return_to']);
            } else {
                $this->redirect('/transactions-list/show');
            }
        }

    }

    /**
     * Action to delete expense from the database
     * 
     * @return void
     */
    public function deleteAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $expense = new Expense($_POST);
            $expense->user_id = $this->user_id;
            if ($expense) {
                $expense->delete();
                Flash::addMessage('Wydatek został usunięty pomyślnie.', Flash::SUCCESS);
            } 
            $this->redirect($_SESSION['return_to']);
        }
    }

    public static function categoryTotalExpensesForSelectedMonthAction() {
        $total_amount = Transactions::getTotalExpensesForCategoryInSelectedMonth($_GET['id'], $_GET['year'], $_GET['month']);
        header('Content-Type: application/json');
        echo json_encode($total_amount);
    }

}

?>