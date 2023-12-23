<?php

namespace App\Controllers;

use App\Models\PaymentMethod;
use Core\View;
use App\Flash;

/**
 * Controller for the settings page
 */
class PaymentMethods extends Authenticated
{

    /**
     * Action to display payment methods list
     * 
     * @return void
     */
    public function showAction()
    {
        View::renderTemplate('Categories_methods\Payment_methods\show.html', );
    }

     /**
     * Action to add new payment method
     * 
     * @return void
     */
    public function addAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $payment_method = new PaymentMethod($_POST);
            $payment_method->user_id = $this->user_id;
            if ($payment_method->save()) {
                $_SESSION['payment_methods'] = PaymentMethod::getPaymentMethodsByUserId($this->user_id);
                Flash::addMessage('Metoda płatności została dodana');
            } else {
                $this->pushFlashMessages($payment_method->errors, Flash::WARNING);
            }
            $this->redirect('/payment-methods');
        }
    }
    
    /**
     * Action to update payment method
     * 
     * @return void
     */
    public function updateAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $payment_method = new PaymentMethod($_POST);
            $payment_method->user_id = $this->user_id;
            if ($payment_method->update()) {
                $_SESSION['payment_methods'] = PaymentMethod::getPaymentMethodsByUserId($this->user_id);
                Flash::addMessage('Metoda płatności została zmieniona.');
            } else {
                $this->pushFlashMessages($payment_method->errors, Flash::WARNING);
            }
        }
        $this->redirect('/payment-methods');
    }
    /**
     * Action to delete payment method from the database
     * 
     * @return void
     */
    public function deleteAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $payment_method = new PaymentMethod($_POST);
            $payment_method->user_id = $this->user_id;
            if ($payment_method->delete()) {
                $_SESSION['payment_methods'] = PaymentMethod::getPaymentMethodsByUserId($this->user_id);
                Flash::addMessage('Metoda płatności usunięta z bazy i z wszystkich transakcji, do których była przypisana.');
            } else {
                Flash::addMessage('Nie udało się usunąć metody płatności', Flash::WARNING);
            }
        }
        $this->redirect('/payment-methods');
    }

    /**
     * Action to validate if payment method already exists in database (AJAX)
     * 
     * @return void
     */
    public static function validateAction()
    {
        $is_valid = !PaymentMethod::methodExists($_GET['name'], $_GET['ignore_id'] ?? null);
        header('Content-Type: application/json');
        echo json_encode($is_valid);
    }

    

}