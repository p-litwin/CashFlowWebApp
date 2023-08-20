<?php

namespace App\Controllers;

/**
 * Authenticated base controller
 */
abstract class Authenticated extends \Core\Controller {
    
    /**
     * Require the user to be logged in before giving access to all methods in the controller
     * 
     * @return void
     */
    public function before() {
        
        $this->requireLogin();
    
    }
}

?>