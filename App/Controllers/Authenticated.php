<?php

namespace App\Controllers;
use App\Auth;
use App\Models\ExpenseCategory;
use App\Models\IncomeCategory;
use App\Models\PaymentMethod;
/**
 * Authenticated base controller
 */
abstract class Authenticated extends \Core\Controller {
    
    
    /**
     * Id of the authenticated user
     * @var integer
     */
    public $user_id;
    /**
     * Require the user to be logged in before giving access to all methods in the controller
     * 
     * @return void
     */
    public function before() {
        
        $this->requireLogin();
        
        if(!isset($_SESSION['user_id'])){
            $this->user_id = Auth::getUser();
        } else {
            $this->user_id = $_SESSION['user_id'];
        }
        if (!isset($_SESSION['income_categories'])) {
            $_SESSION['income_categories'] = IncomeCategory::getIncomeCategoriesByUserId($this->user_id);
        }
        if (!isset($_SESSION['expenses_categories'])) {
            $_SESSION['expenses_categories'] = ExpenseCategory::getExpenseCategoriesByUserId($this->user_id);
        }
        if (!isset($_SESSION['payment_methods'])) {
            $_SESSION['payment_methods'] = PaymentMethod::getPaymentMethodsByUserId($this->user_id);
        }
    }
}

?>