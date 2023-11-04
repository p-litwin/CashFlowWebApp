<?php

namespace App\Controllers;


use App\Models\Expense;
use App\Models\Income;
use App\Models\IncomeCategory;
use App\Models\PaymentMethod;
use App\Models\RememberedLogin;
use Core\View;
use App\Models\ExpenseCategory;
use App\Flash;
use App\Models\User;
use App\Auth;

/**
 * Controller for the settings page
 */
class Settings extends Authenticated
{

    /**
     * Summary of userAccountAction
     * @return void
     */
    public function userAccountAction()
    {
        View::renderTemplate('Settings\user-account.html');
    }

    /**
     * Action to display expenses categories list
     * 
     * @return void
     */
    public function expenseCategoriesAction()
    {
        View::renderTemplate('Settings\expense-categories.html');
    }

    /**
     * Action to update expense category
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
     * Action to delete expense category from the database
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
     * Action to display incomes categories list
     * 
     * @return void
     */
    public function incomeCategoriesAction()
    {
        View::renderTemplate('Settings\income-categories.html', );
    }

    /**
     * Action to update income category
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
     * Action to delete expense category from the database
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
     * Action to display payment methods list
     * 
     * @return void
     */
    public function paymentMethodsAction()
    {
        View::renderTemplate('Settings\payment-methods.html', );
    }
    /**
     * Action to update payment method
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
     * Action to delete payment method from the database
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

    /**
     * Action to change the user name in the settings
     * 
     * @return void
     */
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

    /**
     * Action to change the user email in the settings
     * 
     * @return void
     */
    public function userEmailUpdateAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $new_email = $_POST['email'];
            $user      = new User(Auth::getUser());
            if ($user->email != $new_email) {
                if ($user->updateEmail($new_email))
                    Flash::addMessage('Adres email został zmieniony.');

            } else {
                Flash::addMessage('Adres email jest taki sam jak wpisany do bazy danych.', Flash::WARNING);
            }
        }
        $this->redirect('/settings/user-account');
    }

    /**
     * Action to change the password when the user is logged in
     * 
     * @return void
     */
    public function userPasswordUpdateAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $user = new User(Auth::getUser());
            if ($user->updatePassword($_POST['password'])) {
                Flash::addMessage('Hasło zostało zmienione');
            } else {
                Flash::addMessage('Wystąpił błąd podczas zmiany hasła', Flash::WARNING);
            }
            $this->redirect('/settings/user-account');
        }
    }

    /**
     * Action to delete user and all associated data from the database
     * 
     * @return void
     */

    public function userAccountDeleteAction()
    {

        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $user           = new User(Auth::getUser());
            $user->password = $_POST['password'];
            if ($user->verifyPassword()) {
                if ($user->delete()) {
                    ExpenseCategory::deleteAll($user->userId);
                    IncomeCategory::deleteAll($user->userId);
                    PaymentMethod::deleteAll($user->userId);
                    Expense::deleteAll($user->userId);
                    Income::deleteAll($user->userId);
                    RememberedLogin::deleteAll($user->userId);
                    Auth::logout();
                } else {
                    Flash::addMessage('Usunięcie użytkownika nie powiodło się.', Flash::WARNING);
                    $this->redirect('/settings/user-account');
                }
                View::renderTemplate('DeleteUser\success.html');
            } else {
                Flash::addMessage('Nieprawidłowe hasło.', Flash::WARNING);
                $this->redirect('/settings/user-account');
            }
        }
    }

    /**
     * Action to add new payment method
     * 
     * @return void
     */
    public function paymentMethodAddAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $payment_method = new PaymentMethod($_POST);
            if ($payment_method->save()) {
                Flash::addMessage('Metoda płatności została dodana');
                
            } else {
                Flash::addMessage('Wystąpił błąd w trakcie dodawania metody płatności.', Flash::WARNING);
            }
            $this->redirect('/settings/payment-methods');
        }
    }

    /**
     * Action to add new expense category
     * 
     * @return void
     */
    public function expenseCategoryAddAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $expense_category = new ExpenseCategory($_POST);
            if ($expense_category->save()) {
                Flash::addMessage('Kategoria wydatku została dodana.');
                
            } else {
                Flash::addMessage('Wystąpił błąd w trakcie dodawania kategorii wydatku.', Flash::WARNING);
            }
            $this->redirect('/settings/expense-categories');
        }
    }

    /**
     * Action to add new income category
     * 
     * @return void
     */
    public function incomeCategoryAddAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $income_category = new IncomeCategory($_POST);
            if ($income_category->save()) {
                Flash::addMessage('Kategoria przychodu została dodana.');
                
            } else {
                Flash::addMessage('Wystąpił błąd w trakcie dodawania kategorii przychodu.', Flash::WARNING);
            }
            $this->redirect('/settings/income-categories');
        }
    }

}