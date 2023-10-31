<?php

namespace App\Controllers;


use App\Models\IncomeCategory;
use App\Models\PaymentMethod;
use Core\View;
use App\Models\ExpenseCategory;
use App\Flash;
use App\Models\User;
use App\Auth;

class Settings extends Authenticated
{

    public function userAccountAction()
    {
        View::renderTemplate('Settings\user-account.html');
    }

    /**
     * Controller to display expenses categories list
     * 
     * @return void
     */
    public function expenseCategoriesAction()
    {
        View::renderTemplate('Settings\expense-categories.html');
    }

    /**
     * Controller to update expense category
     * 
     * @return void
     */
    public function expenseCategoryUpdateAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $expense_category = new ExpenseCategory($_POST);
            if ($expense_category->update()) {
                Flash::addMessage('Nazwa kategorii została zmieniona.');
            } else {
                Flash::addMessage('Nie udało się zmienić kategorii wydatku', Flash::WARNING);
            }
        }
        $this->redirect('\settings\expense-categories');
    }

    /**
     * Controller to delete expense category from the database
     * 
     * @return void
     */
    public function expenseCategoryDeleteAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $expense_category = new ExpenseCategory($_POST);
            if ($expense_category->delete()) {
                Flash::addMessage('Kategoria została usunięta. Wszystkie transakcje z tej kategorii pozostały bez kategorii.');
            } else {
                Flash::addMessage('Nie udało się usunąć kategorii wydatku', Flash::WARNING);
            }
        }
        $this->redirect('\settings\expense-categories');
    }
    /**
     * Controller to display incomes categories list
     * 
     * @return void
     */
    public function incomeCategoriesAction()
    {
        View::renderTemplate('Settings\income-categories.html', );
    }

    /**
     * Controller to update income category
     * 
     * @return void
     */
    public function incomeCategoryUpdateAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $income_category = new IncomeCategory($_POST);
            if ($income_category->update()) {
                Flash::addMessage('Nazwa kategorii została zmieniona.');
            } else {
                Flash::addMessage('Nie udało się zmienić kategorii przychodu', Flash::WARNING);
            }
        }
        $this->redirect('\settings\income-categories');
    }

    /**
     * Controller to delete expense category from the database
     * 
     * @return void
     */
    public function incomeCategoryDeleteAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $income_category = new IncomeCategory($_POST);
            if ($income_category->delete()) {
                Flash::addMessage('Kategoria została usunięta. Wszystkie transakcje z tej kategorii pozostały bez kategorii.');
            } else {
                Flash::addMessage('Nie udało się usunąć kategorii wydatku', Flash::WARNING);
            }
        }
        $this->redirect('\settings\income-categories');
    }

    /**
     * Controller to display payment methods list
     * 
     * @return void
     */
    public function paymentMethodsAction()
    {
        View::renderTemplate('Settings\payment-methods.html', );
    }
    /**
     * Controller to update payment method
     * 
     * @return void
     */
    public function paymentMethodUpdateAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $payment_method = new PaymentMethod($_POST);
            if ($payment_method->update()) {
                Flash::addMessage('Metoda płatności została zmieniona.');
            } else {
                Flash::addMessage('Nie udało się zmienić metody płatności', Flash::WARNING);
            }
        }
        $this->redirect('\settings\payment-methods');
    }
    /**
     * Controller to delete payment method from the database
     * 
     * @return void
     */
    public function paymentMethodDeleteAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $payment_method = new PaymentMethod($_POST);
            if ($payment_method->delete()) {
                Flash::addMessage('Metoda płatności usunięta z bazy i z wszystkich transakcji, do których była przypisana.');
            } else {
                Flash::addMessage('Nie udało się usunąć metody płatności', Flash::WARNING);
            }
        }
        $this->redirect('\settings\payment-methods');
    }

    public function userNameUpdateAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $new_name = $_POST['userName'];
            $user     = new User(Auth::getUser());
            if ($user->name != $new_name) {
                if ($user->updateName($new_name))
                    Flash::addMessage('Imię zostało zmienione.');
                
            } else {
                Flash::addMessage('Imię jest takie samo jak wpisane do bazy danych.', Flash::WARNING);
            } 
        }
        $this->redirect('/settings/user-account');
    }

    public function userEmailUpdateAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $new_email = $_POST['email'];
            $user     = new User(Auth::getUser());
            if ($user->email != $new_email) {
                if ($user->updateEmail($new_email))
                    Flash::addMessage('Adres email został zmieniony.');
                
            } else {
                Flash::addMessage('Adres email jest taki sam jak wpisany do bazy danych.', Flash::WARNING);
            } 
        }
        $this->redirect('/settings/user-account');
    }

}