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
                $this->pushFlashMessages($payment_method->errors, Flash::WARNING);
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
                $this->pushFlashMessages($payment_method->errors, Flash::WARNING);
            }
            $this->redirect('/settings/payment-methods');
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
                $this->pushFlashMessages($income_category->errors, Flash::WARNING);
            }
            $this->redirect('/settings/income-categories');
        }
    }

    /**
     * Action to validate if payment method already exists in database (AJAX)
     * 
     * @return void
     */
    public static function validatePaymentMethodAction()
    {
        $is_valid = !PaymentMethod::methodExists($_GET['name']);
        header('Content-Type: application/json');
        echo json_encode($is_valid);
    }

    /**
     * Action to validate if income category already exists in database (AJAX)
     * 
     * @return void
     */
    public static function validateIncomeCategoryAction()
    {
        $is_valid = !IncomeCategory::categoryExists($_GET['name']);
        header('Content-Type: application/json');
        echo json_encode($is_valid);
    }

}