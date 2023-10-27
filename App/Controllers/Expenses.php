<?php

namespace App\Controllers;

use App\Flash;
use App\Models\PaymentMethod;
use Core\View;
use App\Models\ExpenseCategory;
use App\Models\Expense;

/**
 * Expense controller
 */
class Expenses extends \App\Controllers\Authenticated
{

    /**
     * Display form to get the data of new expense from the users
     * @return void
     */
    public function newAction()
    {
        $_SESSION['expenses_categories'] = ExpenseCategory::getExpenseCategoriesByUserId($_SESSION['user_id']);
        $_SESSION['payment_methods']     = PaymentMethod::getPaymentMethodsByUserId($_SESSION['user_id']);

        View::renderTemplate('\Expense\new.html', [
            'expenses_categories' => $_SESSION['expenses_categories'],
            'payment_methods'     => $_SESSION['payment_methods']
        ]);
    }

    /**
     * Add new expense
     * @return void
     */
    public function addAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $expense = new Expense($_POST);

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
     * Action to delete expenses from the database
     * 
     * @return void
     */
    public function deleteAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $expense = new Expense($_POST);
            if ($expense->delete()) {
                Flash::addMessage('Wydatek został usunięty pomyślnie.', Flash::SUCCESS);
            } else {
                Flash::addMessage('Wystąpił błąd w trakcie usuwania wydatku.', Flash::WARNING);
            }
            $this->redirect($_SESSION['return_to']);
        }
    }

}

?>