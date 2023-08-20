<?php

namespace App\Models;

use App\Token;
use App\Mail;
use Core\View;
use PDO;

/**
 * User class
 */
class User extends \Core\Model{


    /**
     * Validation errors
     * @var array
     */
    public $errors = [];

    /**
     * User id
     * @var integer
     */
    public $userId;
    
    /**
     * Name of the user
     * @var string
     */
    public $name;

    /**
     * User email addres
     * @var string
     */
    public $email;

    /**
     * Summary of password
     * @var string
     */
    public $password;
    
    /**
     * Password_hash
     * @var string
     */
    private $password_hash;

    /**
     * Remember login token
     * 
     * @var string
     */
    private $remember_token;

    /**
     * User class constructor
     *  
     * @param array $data Initial property values   
     */

     /**
     * expiry timestamp for remembered login
     *  
     * @param int
     */
    private $expiry_timestamp;
    
    /**
     * Reset token
     * 
     * @var string
     */

    private $reset_token;
    
    /**
     * $password_reset_hash
     * 
     * @var string
     */
    
    private $password_reset_hash;

    /**
     * Password reset expiry date and time
     * @var string
     */
    private $password_reset_expiry;

    /**
     * Summary of is_active
     * @var boolean
     */
    private $is_active;

    /**
     * Summary of activation_token
     * @var string
     */
    private $activation_token;

    /**
     * Summary of activation_token_hash
     * @var string
     */
    private $activation_token_hash;

    /**
     * Summary of __construct
     * @param mixed $data
     */
    public function __construct($data =[]){
        foreach ($data as $key => $value) {
            $this->$key = $value;
        }
    }

    /**
     * Save the user model with current properties
     * 
     * @return mixed
     */
    public function save(){
        
        $this->validate();

        if (empty($this->errors)) {
            $password_hash = password_hash($this->password, PASSWORD_DEFAULT);
            $activation_token = new Token();
            $this->activation_token_hash = $activation_token->getHash();
            $this->activation_token = $activation_token->getValue();

            $sql = "INSERT INTO users (name, email, password_hash, activation_token_hash, is_active)
                VALUES (:name, :email, :password_hash, :activation_token_hash, :is_active)";

            $db        = static::getDB();
            $statement = $db->prepare($sql);

            $statement->bindValue(':name', $this->name, PDO::PARAM_STR);
            $statement->bindValue(':email', $this->email, PDO::PARAM_STR);
            $statement->bindValue(':password_hash', $password_hash, PDO::PARAM_STR);
            $statement->bindValue(':activation_token_hash', $this->activation_token_hash, PDO::PARAM_STR);
            $statement->bindValue(':is_active', false, PDO::PARAM_BOOL);

            return $statement->execute();

        } else {

        return false;

        }

    }

    /**
     * Validate form fields for registering new user
     * @return void
     */

    protected function validate(){
        if ($this->name == '') {
            $this->errors[] = 'Name is required';
        }

        if (filter_var($this->email, FILTER_VALIDATE_EMAIL) === false) {
            $this->errors[] = 'Invalid email';
        }

        if (static::emailExists($this->email, $this->userId ?? null)) {
            $this->errors[] = 'Email already taken';
        }

        $this->validatePassword();
        
    }

    /**
     * Validate password from the form
     * @return void
     */
    protected function validatePassword(){
        if (isset($this->password)) {
            if (strlen($this->password) < 6) {
                $this->errors[] = 'Password must be at least 6 characters long';
            }
            
            if (preg_match('/[a-z]+/i',  $this->password) == 0) {
                $this->errors[] = 'Password needs at least one letter';
            }
            
            if (preg_match('/[\d]+/i',  $this->password) == 0) {
                $this->errors[] = 'Password needs at least one digit';
            }
        }
    }

    /**
     * Check if username with given email exists in the database
     * @param string $email user login in the form of email
     * @return bool
     */
    public static function emailExists($email, $ignore_id = null) {
        
        $user = static::findByEmail($email);

        if ($user) {
            if ($user->userId != $ignore_id) {
                return true;
            }
        }

        return false;

    }

    /**
     * Find user with the given email in the database
     * @param string $email email address to search for
     * @return mixed User object if found
     */
    public static function findByEmail($email) {
        $sql = 'SELECT * FROM users WHERE email = :email';

        $db = static::getDB();
        $statement = $db->prepare($sql);
        $statement->bindValue(':email', $email, PDO::PARAM_STR);
        $statement->setFetchMode(PDO::FETCH_CLASS, get_called_class());
        $statement->execute();

        return $statement->fetch();
    }

    /**
     * Verify if the login credentials are correct
     * @param string $email login
     * @param string $password password
     * @return mixed if login successful return object of the User class otherwise returns false.
     */
    public static function authenticate($email, $password) {
        
        $user = static::findByEmail($email);

        if ($user && $user->is_active) {
            
            if(password_verify($password, $user->password_hash))
            return $user;
        }
        return false;
    }

    /**
     * Find user with the given id in the database
     * @param string $email email address to search for
     * @return mixed User object if found
     */
    public static function findById($userId) {
        $sql = 'SELECT * FROM users WHERE userId = :userId';

        $db = static::getDB();
        $statement = $db->prepare($sql);
        $statement->bindValue(':userId', $userId, PDO::PARAM_INT);
        $statement->setFetchMode(PDO::FETCH_CLASS, get_called_class());
        $statement->execute();

        return $statement->fetch();
    }

    /**
     * Summary of rememberLogin
     * @return mixed
     */
    public function rememberLogin() {
        
        $token = new Token();
        $token_hash = $token->getHash();
        $this->remember_token = $token->getValue();

        $this->expiry_timestamp = time() + 60 * 60 * 24 * 30; // 30 days expiry time;
        

        $sql = "INSERT INTO remembered_login (token_hash, userId, expires_at)
                VALUES (:token_hash, :userId, :expires_at)";

            $db = static::getDB();
            $statement = $db->prepare($sql);

            $statement->bindValue(':token_hash', $token_hash, PDO::PARAM_STR);
            $statement->bindValue(':userId', $this->userId, PDO::PARAM_INT);
            $statement->bindValue(':expires_at', date('Y-m-d H:i:s', $this->expiry_timestamp), PDO::PARAM_STR);

            return $statement->execute();
    }


    /**
     * Get the remember_token value
     * 
     * @return string
     */
	public function getRemember_token() {
		return $this->remember_token;
	}

	/**
	 * Get Expiry timestamp
	 * 
	 * @return int
	 */
	public function getExpiry_timestamp() {
		return $this->expiry_timestamp;
	}
	
    /**
     * Find the user by email send the password reset message when found in the database
     * 
     * @param mixed $email email (login) of the user which wants to reset password
     * @return void
     */
    public static function sendPasswordReset($email) {
        $user = static::findByEmail($email);

        if ($user) {
            
            if($user->startPasswordReset()){

                $user->sendPasswordResetEmail();

            }

        }
    }

    /**
     * Start password reset process.
     * Generate the token and token_hash, set the expiry timestamp and update the database
     * with token_hash and token expiry date
     * 
     * @return mixed
     */
    protected function startPasswordReset() {
        $reset_token = new Token();
        $reset_token_hash = $reset_token->getHash();
        $this->reset_token = $reset_token->getValue();

        $expiry_timestamp = time() + 60 * 60 * 2; // 2 hours expiry time;

        $sql = 'UPDATE users
                SET password_reset_hash = :reset_token_hash, password_reset_expiry = :password_reset_expiry
                WHERE userId = :userId';

        $db = static::getDB();
        $statement = $db->prepare($sql);
        $statement->bindValue(':reset_token_hash', $reset_token_hash, PDO::PARAM_STR);
        $statement->bindValue(':password_reset_expiry', date('Y-m-d H:i:s', $expiry_timestamp), PDO::PARAM_STR);
        $statement->bindValue(':userId', $this->userId, PDO::PARAM_INT);
        
        return $statement->execute();

    }

    /**
     * Send password reset email
     * 
     * @return void
     */
    protected function sendPasswordResetEmail() {

        $url = 'http://' . $_SERVER['HTTP_HOST'] . '/password/reset/' . $this->reset_token;
        
        $text = View::getTemplate('Password\reset_email.txt', ['url'=>$url]);
        $html = View::getTemplate('Password\reset_email.html', ['url'=>$url]);

        Mail::send($this->email, 'Password reset', $text, $html);

    }

    /**
     * Summary of sendActivationEmail
     * @return void
     */
    public function sendActivationEmail() {

        $url = 'http://' . $_SERVER['HTTP_HOST'] . '/signup/activate/' . $this->activation_token;
        
        $text = View::getTemplate('Signup\activate.txt', ['url'=>$url]);
        $html = View::getTemplate('Signup\activate.html', ['url'=>$url]);

        Mail::send($this->email, 'Activate your account', $text, $html);

    }

    /**
     * Get the user from the database based on the password reset token hash
     * 
     * @param string $password_reset_hash
     * @return mixed
     */
    public static function findByToken($reset_token) {
        
        $token = new Token($reset_token);
        $password_reset_hash = $token->getHash();
        
        $sql = 'SELECT * FROM users WHERE password_reset_hash = :password_reset_hash';

        $db = static::getDB();
        $statement = $db->prepare($sql);
        $statement->bindValue(':password_reset_hash', $password_reset_hash, PDO::PARAM_STR);
        $statement->setFetchMode(PDO::FETCH_CLASS, get_called_class());
        $statement->execute();

        $user = $statement->fetch();

        if ($user) {
            if (strtotime($user->password_reset_expiry) > time()) {
                return $user;
            }
        }

    }


	/**
	 * Get password reset expiry value
	 * @return string password reset expriry in format 'Y-m-d H:i:s'
	 */
	public function getPassword_reset_expiry() {
		return $this->password_reset_expiry;
	}

    /**
     * Summary of changePassword
     * @param mixed $reset_token
     * @param mixed $new_password
     * @return mixed
     */
    public function changePassword($reset_token, $new_password) {
        
        $this->password = $new_password;
        $this->validatePassword();
        
        $token = new Token($reset_token);
        $password_reset_hash = $token->getHash();
        
        if (empty($this->errors)) {
            
            $password_hash = password_hash($new_password, PASSWORD_DEFAULT);
            $this->password_hash = $password_hash;

            $sql = 'UPDATE users
                    SET password_hash = :password_hash,
                    password_reset_hash = NULL,
                    password_reset_expiry = NULL
                    WHERE password_reset_hash = :password_reset_hash';

            $db        = static::getDB();
            $statement = $db->prepare($sql);

            $statement->bindValue(':password_reset_hash', $password_reset_hash, PDO::PARAM_STR);
            $statement->bindValue(':password_hash', $this->password_hash, PDO::PARAM_STR);

            return $statement->execute();

        } else {

        return false;

        }

    }

    /**
     * Udpate the user record in the database to activate user
     * 
     * @param string $activation_token Activation token generated on signup
     * 
     * @return void
     */
    public static function activate($activation_token) {

        $activation_token = new Token($activation_token);
        $activation_token_hash = $activation_token->getHash();

        $sql = 'UPDATE users
                SET activation_token_hash = NULL,
                is_active = true
                WHERE activation_token_hash = :activation_token_hash';
        
        $db        = static::getDB();
        $statement = $db->prepare($sql);

        $statement->bindValue(':activation_token_hash', $activation_token_hash, PDO::PARAM_STR);

        $statement->execute();

    }

    public function updateProfile($data) {
        
        $this->name = $data['name'];
        $this->email = $data['email'];
        
        if ($data['password'] != '') {
            $this->password = $data['password'];
        }

        $this->validate();
            
        if (empty($this->errors)) {
        
            $sql = "UPDATE users
                    SET name = :name,
                    email = :email";

            if (isset($this->password)) {
        
                $sql .= ", password_hash = :password_hash";
                
            }
            
            $sql .= "\nWHERE userId = :userId";
            
            $db        = static::getDB();
            $statement = $db->prepare($sql);

            $statement->bindValue(':name', $this->name, PDO::PARAM_STR);
            $statement->bindValue(':email', $this->email, PDO::PARAM_STR);
            $statement->bindValue(':userId', $this->userId, PDO::PARAM_INT);
            
            if (isset($this->password)) {
                
                $password_hash = password_hash($this->password, PASSWORD_DEFAULT);
                $statement->bindvalue(':password_hash', $this->password_hash, PDO::PARAM_STR);

            }

            return $statement->execute();

        }

        return false;

    }

}

?>