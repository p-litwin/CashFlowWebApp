<?php

namespace App\Models;

use Core\Model;
use PDO;
use App\Token;

/**
 * Model to retrieve and save data in the remembered_login table
 */
class RememberedLogin extends Model {
    
    /**
     * User ID
     * @var int
     */
    public $userId;
 
    /**
     * Token hash
     * @var string
     */
    public $token_hash;
 
    /**
     * Token expiry
     * @var string
     */
    public $expires_at;
    /**
     * Summary of findByToken
     * @param string $token Login token
     * 
     * @return object Returns RemeberedLogin object if the corresponding record is found in the database
     */
    public static function findByToken($token) {
        $token = new Token($token);
        $token_hash = $token->getHash();
        
        $sql = "SELECT * FROM remembered_login
                WHERE token_hash = :token_hash";

        $db        = static::getDB();
        $statement = $db->prepare($sql);
        $statement->bindValue(':token_hash', $token_hash, PDO::PARAM_STR);
        $statement->setFetchMode(PDO::FETCH_CLASS, get_called_class());

        $statement->execute();

        return $statement->fetch();
    }

    /**
     * Get the user object based on the user Id
     * 
     * @return mixed
     */
    public function getUser() {
        return User::findById($this->userId);

    }

    /**
     * Check if the remebered login has expired
     * 
     * @return bool True if the expires_at value in the database represents earlier date than now.
     */
    public function hasExpired() {

        return strtotime($this->expires_at) < time();

    }

    /**
     * Delete remembered token from the database
     * 
     * @param string $token Remembered login token
     * 
     * @return void
     */
    public function deleteByToken($token) {
        
        $token = new Token($token);
        $token_hash = $token->getHash();
        
        $sql = "DELETE FROM remembered_login
        WHERE token_hash = :token_hash";

        $db        = static::getDB();
        $statement = $db->prepare($sql);
        $statement->bindValue(':token_hash', $token_hash, PDO::PARAM_STR);

        $statement->execute();
        
    }

}

?>