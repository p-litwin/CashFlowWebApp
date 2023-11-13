<?php

namespace App\Controllers;
use App\Auth;

/**
 * Authenticated base controller
 */
abstract class Authenticated extends \Core\Controller {
    
    
    /**
     * Object of the User class
     * @var object
     */
    public $user;
    /**
     * Require the user to be logged in before giving access to all methods in the controller
     * 
     * @return void
     */
    public function before() {
        
        $this->requireLogin();
        $this->user = Auth::getUser();
    
    }
}

?>