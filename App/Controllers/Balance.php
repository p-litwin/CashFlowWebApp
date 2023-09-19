<?php

namespace App\Controllers;

use Core\View;
/**
 * Display balance of expenses and incomes
 */
class Balance extends \App\Controllers\Authenticated {

    /**
     * Summary of showAction
     * @return void
     */
    public function showAction() {
        View::renderTemplate('\Balance\show.html');
    }

}

?>