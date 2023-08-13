<?php

namespace App\Controllers;

use \Core\View;
use \App\Auth;

/**
 * Home controller
 */
class Home extends \Core\Controller {
    /**
     * Show the index page
     * @return void
     */
    public function indexAction() {
        View::renderTemplate('Login/new.html');
    }

    /**
     * Before filter - called before an action method
     * 
     * @return void
     */
    protected function before() {

    }

    /**
     * After filter - called after an action  method
     * @return void
     */
    protected function after() {

    }

}