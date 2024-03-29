<?php

namespace App\Controllers;

use App\Flash;
use App\Models\User;
use Core\View;
use App\Models\IncomeCategory;
use App\Models\ExpenseCategory;
use App\Models\PaymentMethod;

class Signup extends \Core\Controller {

    /**
     * Create new user action
     * @return void
     */
    public function createAction() {
        $user = new User($_POST);

        if ($_SERVER['REQUEST_METHOD'] != 'POST') {
            
            View::renderTemplate('Signup/new.html');
        
        } else {

            if ($user->save()) {
                
                $user->sendActivationEmail();
                
                $this->redirect('/Signup/success');

            } else {
                
                View::renderTemplate('Signup/new.html', [ 'user' => $user]);
            
            }
        }
    }

    /**
     * Show the signup success page
     * 
     * @return void
     */
    public function successAction() {

        View::renderTemplate('Signup/success.html');

    }

    /**
     * Activate user after clicking the link in email
     * 
     * @return void
     */
    public function activateAction() {
        
        $activation_token = $this->route_params['token'];
        $user = User::findByActivationToken($activation_token);
        if ($user) {
            User::activate($activation_token);
            IncomeCategory::copyDefaultIncomesCategoriesByUserId($user->userId);
            ExpenseCategory::copyDefaultExpensesCategoriesByUserId($user->userId);
            PaymentMethod::copyDefaultPaymentMethodsByUserId($user->userId);
            $this->redirect('/signup/activated');
        } else {
            Flash::addMessage('Nieprawidłowy link aktywacyjny lub konto zostało już aktywowane.');
            $this->redirect('\login');
        }
    }

    /**
     * Display the success activation page
     * 
     * @return void
     */
    public function activatedAction() {
        View::renderTemplate(('Signup/activated.html'));
    }

    /**
     * Validate if email already exists in database (AJAX)
     * 
     * @return void
     */
    public function validateEmailAction() {
        $is_valid = !User::emailExists($_GET['email'], $_GET['ignore_id'] ?? null);
        header('Content-Type: application/json');
        echo json_encode($is_valid);
    }

}

?>