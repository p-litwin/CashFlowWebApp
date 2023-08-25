<?php

namespace App\Controllers;

use Core\View;

/**
 * Expense controller
 */
class Income extends \Core\Controller {


    /**
     * Display form to get the data of new expense from the users
     * @return void
     */
    public static function newAction() {
        View::renderTemplate('\Income\new.html');
    }


}

?>