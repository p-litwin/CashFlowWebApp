<?php

namespace App\Controllers;

use \Core\View;
use \App\Models\User;
use \App\Flash;
class Password extends \Core\Controller {


    /**
     * Action to render the forgotten password form
     * 
     * @return void
     */
    public function forgotAction() {
        View::renderTemplate('Password/forgot.html');
    }
    
    /**
     * Action to reset user password
     * @return void
     */
    public function resetAction() {
        $token = $this->route_params['token'];
        $user = $this->getUserOrExit($token);
        View::renderTemplate('Password\password_reset.html', ['user'=>$user, 'token'=>$token]);
    }

    /**
     * Send the password reset link to the supplied email
     * 
     * @return void
     */
    public function requestResetAction() {
        User::sendPasswordReset($_POST['email']);
        View::renderTemplate('Password/reset_requested.html');
    }

    /**
     * Reset the user's password
     * 
     * @return void
     */

    public function resetPasswordAction() {
        $token = $_POST['token'];
        
        $user = $this->getUserOrExit($token);

        $new_password = $_POST['password'];
            
        if ($user->changePassword($token, $new_password)) {
            
            Flash::addMessage('Hasło zostało zmienione. Możesz się teraz zalogować.', Flash::SUCCESS);
            View::renderTemplate('Login/new.html');
        
        }
 
    }

    /**
     * Get the User object or exit the script
     * @param mixed $token
     * @return mixed return User object if the user
     */
    protected function getUserOrExit($token) {
        
        $user = User::findByResetToken($token);

        if ($user) {
            return $user;
        }
        
        Flash::addMessage('Link resetu hasła jest nieprawidłowy lub wygasł.', Flash::WARNING);
        $this->redirect('/');
        exit();

    }

}

?>