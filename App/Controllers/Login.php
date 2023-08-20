<?php

namespace App\Controllers;

use \App\Auth;
use \App\Models\User;
use \Core\View;
use \App\Flash;
use \App\Token;

/**
 * Login controller
 */
class Login extends \Core\Controller {

    /**
     * Show the login page
     * 
     * @return void
     */
    public function newAction() {
        View::renderTemplate('Login/new.html');
    }

    /**
     * Authenticate user
     * @return void
     */
    public function createAction() {
        $user = User::authenticate($_POST['email'], $_POST['password']);
        
        $remember_me = isset($_POST['remember_me']);
        
        if ($user) {
            
            Auth::login($user, $remember_me);

            Flash::addMessage('Login succesful');

            $this->redirect(Auth::getReturnToPage());

        } else {

            Flash::addMessage('Login unsuccessful, please try again', Flash::WARNING);

            View::renderTemplate('Login/new.html', [
            'email'=> $_POST['email'],
            'remember_me'=> $remember_me
            ]);
            
        }
    }

    /**
     * Destroy current session
     * 
     * @return void
     */
    public function destroyAction() {
       
        Auth::logout();
        
        $this->redirect('/login/show-logout-message');

    }

    /**
     * Show flash message after successful logout
     * 
     * @return void
     */
    public function showLogoutMessage() {
        
        Flash::addMessage('Logout succesfull');
        
        $this->redirect('/');

    }

}

?>
