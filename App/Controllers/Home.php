<?php

namespace App\Controllers;

use \Core\View;
use \App\Auth;

/**
 * Home controller
 */
class Home extends Authenticated {
    /**
     * Show the index page
     * @return void
     */
    public function indexAction() {
        View::renderTemplate('Home/index.html');
    }

}