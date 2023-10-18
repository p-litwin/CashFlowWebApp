<?php

namespace App\Controllers;

use App\Flash;
use App\Models\PaymentMethods;
use Core\View;
use App\Models\ExpensesCategories;
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
        $_SESSION['expenses_categories'] = ExpensesCategories::getExpensesCategoriesByUserId($_SESSION['user_id']);
        $_SESSION['payment_methods']     = PaymentMethods::getPaymentMethodsByUserId($_SESSION['user_id']);

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
                View::renderTemplate('\Expense\new.html', [
                    'last_expense_category'       => $expense->category,
                    'last_expense_payment_method' => $expense->payment_method,
                    'expenses_categories'         => $_SESSION['expenses_categories'],
                    'payment_methods'             => $_SESSION['payment_methods']
                ]);
            } else {
                foreach ($expense->errors as $error) {
                    Flash::addMessage($error, Flash::WARNING);
                }
                View::renderTemplate('\Expense\new.html', [
                    'expense'             => $expense,
                    'expenses_categories' => $_SESSION['expenses_categories'],
                    'payment_methods'     => $_SESSION['payment_methods']
                ]);
            }
        } else {
            $this->redirect("/expenses/new");
        }

    }

    public function updateAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $expense = new Expense($_POST);
        }
        
        if ($expense->update()){
            Flash::addMessage('Wydatek został zaktualizowany');
            if (isset($_SESSION['return_to'])){
                $this->redirect($_SESSION['return_to']);
            } else {
                $this->redirect('/transactions-list/show');
            }
        } else {
            Flash::addMessage('Wydatek nie został zaktualizowany', Flash::WARNING);
            if (isset($_SESSION['return_to'])){
                $this->redirect($_SESSION['return_to']);
            } else {
                $this->redirect('/transactions-list/show');
            }
        }

    }
}

?>