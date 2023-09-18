<?php

namespace App\Controllers;

use App\Models\User;
use Core\View;
use App\Models\IncomesCategories;
use App\Models\ExpensesCategories;
use App\Models\PaymentMethods;

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
        User::activate($activation_token);
        IncomesCategories::copyDefaultIncomesCategoriesByUserId($user->userId);
        ExpensesCategories::copyDefaultExpensesCategoriesByUserId($user->userId);
        PaymentMethods::copyDefaultPaymentMethodsByUserId($user->userId);
        $this->redirect('/signup/activated');
    }

    /**
     * Display the success activation page
     * 
     * @return void
     */
    public function activatedAction() {
        View::renderTemplate(('Signup/activated.html'));
    }

}

?>