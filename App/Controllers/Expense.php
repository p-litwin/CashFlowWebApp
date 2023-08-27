<?php

namespace App\Controllers;

use App\Models\User;
use Core\View;

/**
 * Expense controller
 */
class Expense extends \Core\Controller {


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


}

?>