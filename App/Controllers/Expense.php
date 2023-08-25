<?php

namespace App\Controllers;

use Core\View;

class Expense extends \Core\Controller {


    public static function newAction() {
        View::renderTemplate('\Expense\new.html');
    }


}

?>