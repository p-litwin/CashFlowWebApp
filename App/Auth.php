<?php

namespace App;

use App\Models\User;
use App\Models\RememberedLogin;

/**
 * User authentication class
 */
class Auth {

    /**
     * Login the user
     * 
     * @param object $user Object of the User class
     * 
     * @return void
     */
    public static function login($user, $remember_me) {
        
        session_regenerate_id(true);
        
        $_SESSION['user_id'] = $user->userId;

        if ($remember_me) {

            if($user->rememberLogin()) {
                
                setcookie('remember_me', $user->getRemember_token(), $user->getExpiry_timestamp(), '/');
                
            }

        }

    }

    /**
     * Logout the user
     * 
     * @return void
     */
    public static function logout() {
        
        // Unset all of the session variables.
         $_SESSION = array();

         // If it's desired to kill the session, also delete the session cookie.
         // Note: This will destroy the session, and not just the session data!
         if (ini_get("session.use_cookies")) {
             $params = session_get_cookie_params();
             setcookie(session_name(),
                         '',
                         time() - 42000,
                         $params["path"],
                         $params["domain"],
                         $params["secure"],
                         $params["httponly"]
             );
         }

         // Finally, destroy the session.
         session_destroy();

         static::forgetLogin();

    }

    /**
     * Remember the requested url in the session
     * 
     * @return void
     */
    public static function rememberRequestedPage() {
        
        $_SESSION['return_to'] = $_SERVER['REQUEST_URI'];

    }

    /**
     * Get the remembered requested url from the session.
     * 
     * @return string requested url from the $_SESSION or '/' if 'return to' not set in the $_SESSION
     */
    public static function getReturnToPage() {
        
        return $_SESSION['return_to'] ?? '/';

    }

    /**
     * Get the current logged in user from the session or the remember me cookie
     * 
     * @return mixed The user model or null if not logged in
     */
    public static function getUser() {
        
        if (isset($_SESSION['user_id'])) {
            return User::findById($_SESSION['user_id']);
        } else {
            return static::loginFromRememberCookie();
        }
    }

    /**
     * Delete remembered login from the database
     * 
     * @return mixed
     */
    protected static function loginFromRememberCookie() {

        $cookie = $_COOKIE['remember_me'] ?? false;

        if ($cookie) {

            $remembered_login = RememberedLogin::findByToken($cookie);

            if ($remembered_login) {
                
                if (! $remembered_login->hasExpired()) {
                
                    $user = $remembered_login->getUser();

                    static::login($user, false);

                    return $user;

                } else {

                    $remembered_login->deleteByToken($cookie);

                }

            }

        }

    }

    /**
     * Forget remembered login
     * 
     * @return void
     */
    protected static function forgetLogin() {

        $cookie = $_COOKIE['remember_me'] ?? false;
                
        if ($cookie) {
            
            $remembered_login = RememberedLogin::findByToken($cookie);

            if ($remembered_login) {
                $remembered_login->deleteByToken($cookie);
            }

            setcookie('remember_me','', time()-3600,  '/'); // set to expire in the past

        }
    }
    
}


?>