<?php

namespace App\Controllers;

use App\Flash;
use App\Models\User;
use Core\View;
use App\Models\Expense;

/**
 * Expense controller
 */
class Expenses extends \App\Controllers\Authenticated {

    /**
     * Display form to get the data of new expense from the users
     * @return void
     */
    public static function newAction() {
        $user_categories[] = User::getUserExpensesCategories($_SESSION['user_id']);
        $user_payment_methods[] = User::getUserPaymentMethods($_SESSION['user_id']);
        View::renderTemplate('\Expense\new.html', [
                'user_categories'=>$user_categories[0],
                'user_payment_methods'=>$user_payment_methods[0]
            ]);
    }

    /**
     * Add new expense
     * @return void
     */
    public static function addAction() {
        $expense = new Expense($_POST);
        
        if ($expense->save()){
            Flash::addMessage('Wydatek został dodany');
            View::renderTemplate('\Expense\new.html', [
                'expense'=>$expense
            ]);
        }  else {
            foreach ($expense->errors as $error) {
                Flash::addMessage($error, Flash::WARNING);
            }
            View::renderTemplate('\Expense\new.html', [
                'expense'=>$expense
            ]);
        } 
    
    }

}

?>