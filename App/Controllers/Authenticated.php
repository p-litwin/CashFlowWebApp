<?php

namespace App\Controllers;
use App\Auth;

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
    
    }
}

?>