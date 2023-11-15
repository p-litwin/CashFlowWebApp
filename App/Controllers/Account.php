<?php

namespace App\Controllers;

use App\Auth;
use App\Flash;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\Income;
use App\Models\IncomeCategory;
use App\Models\PaymentMethod;
use App\Models\RememberedLogin;
use App\Models\User;
use Core\View;

class Account extends Authenticated {

    
    /**
     * Summary of userAccountAction
     * @return void
     */
    public function showAction()
    {
        View::renderTemplate('Account\show.html');
    }

    /**
     * Action to change the user name
     * 
     * @return void
     */
    public function userNameUpdateAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $new_name = $_POST['userName'];
            $user = new User(Auth::getUser());
            if ($user->name != $new_name) {
                if ($user->updateName($new_name))
                    Flash::addMessage('Imię zostało zmienione.');

            } else {
                Flash::addMessage('Imię jest takie samo jak wpisane do bazy danych.', Flash::WARNING);
            }
        }
        $this->redirect('/account');
    }

    /**
     * Action to change the user email
     * 
     * @return void
     */
    public function userEmailUpdateAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $new_email = $_POST['email'];
            $user      = new User(Auth::getUser());
            if ($user->email != $new_email) {
                if ($user->updateEmail($new_email))
                    Flash::addMessage('Adres email został zmieniony.');

            } else {
                Flash::addMessage('Adres email jest taki sam jak wpisany do bazy danych.', Flash::WARNING);
            }
        }
        $this->redirect('/account');
    }

    /**
     * Action to change the password when the user is logged in
     * 
     * @return void
     */
    public function userPasswordUpdateAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $user = new User(Auth::getUser());
            if ($user->updatePassword($_POST['password'])) {
                Flash::addMessage('Hasło zostało zmienione');
            } else {
                Flash::addMessage('Wystąpił błąd podczas zmiany hasła', Flash::WARNING);
            }
            $this->redirect('/account');
        }
    }

    /**
     * Action to delete user and all associated data from the database
     * 
     * @return void
     */

     public function deleteAction()
     {
 
         if ($_SERVER['REQUEST_METHOD'] == 'POST') {
             $user           = new User(Auth::getUser());
             $user->password = $_POST['password'];
             if ($user->verifyPassword()) {
                 if ($user->delete()) {
                     ExpenseCategory::deleteAll($user->userId);
                     IncomeCategory::deleteAll($user->userId);
                     PaymentMethod::deleteAll($user->userId);
                     Expense::deleteAll($user->userId);
                     Income::deleteAll($user->userId);
                     RememberedLogin::deleteAll($user->userId);
                     Auth::logout();
                 } else {
                     Flash::addMessage('Usunięcie użytkownika nie powiodło się.', Flash::WARNING);
                     $this->redirect('/account');
                 }
                 View::renderTemplate('DeleteUser\success.html');
             } else {
                 Flash::addMessage('Nieprawidłowe hasło.', Flash::WARNING);
                 $this->redirect('/account');
             }
         }
     }

}

?>