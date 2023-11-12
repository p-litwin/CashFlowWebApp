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

    

}