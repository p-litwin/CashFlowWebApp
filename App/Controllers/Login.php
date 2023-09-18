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
        
        if (!isset($_SESSION['user_id'])) {
        
            View::renderTemplate('Login/new.html');
        
        } else {

            $this->redirect('/');
       
        }
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

            Flash::addMessage('Zalogowano');

            $this->redirect(Auth::getReturnToPage());

        } else {

            Flash::addMessage('Niepoprawne dane, spróbuj ponownie', Flash::WARNING);

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
        
        Flash::addMessage('Wylogowano');
        
        $this->redirect('/login');

    }

}

?>
