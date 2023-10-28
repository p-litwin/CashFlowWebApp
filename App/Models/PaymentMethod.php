<?php

namespace App\Models; 

use Core\Model;
use PDO;

/**
 * Model to handle the payment methods
 */

 class PaymentMethod extends Model {
    /**
     * Payment method id in the database
     * @var int
     */
    public $id;

    /**
     * Payment method name in the database
     * @var string
     */
    public $name;

    /**
     * Summary of __construct
     * 
     * @param array $data Associative array containing the payment method data
     */
    public function __construct($data =[]){
        foreach ($data as $key => $value) {
            $this->$key = $value;
        }
    }
    /**
     * Get payment methods from the database
     * @param integer $user_id Id of logged in user
     * @return array Associative array of the payment method id and payment method name
     */
    public static function getPaymentMethodsByUserId($user_id) {
        
        $sql = 'SELECT id, name
                FROM payment_methods_assigned_to_users
                WHERE user_id = :user_id
                ORDER BY name';

        $db = static::getDB();
        $statement = $db->prepare($sql);
        $statement->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->execute();

        return $statement->fetchAll();
    }

    /**
     * Copy default payment methods for user with given id
     * @param integer $user_id Id of logged in user
     * @return void
     */
    public static function copyDefaultPaymentMethodsByUserId($user_id) {
        
        $sql = 'INSERT INTO payment_methods_assigned_to_users (name, user_id)
                SELECT name, :user_id
                FROM payment_methods_default;';

        $db = static::getDB();
        $statement = $db->prepare($sql);
        $statement->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $statement->execute();

    }

    /**
     * Update the income category in the database
     * 
     * @return boolean True if the category has been updated, false otherwise
     */
    public function update() {
        
        $sql = 'UPDATE payment_methods_assigned_to_users
                SET name = :name
                WHERE id=:id AND user_id=:user_id;';

        $db = static::getDB();
        $statement = $db->prepare($sql);
        $statement->bindValue(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
        $statement->bindValue(':id', $this->id, PDO::PARAM_INT);
        $statement->bindValue(':name', $this->name, PDO::PARAM_STR);
        return $statement->execute();
    }

    /**
     * Delete the income category from the database
     * 
     * @return boolean True if the category has been removed, false otherwise
     */
    public function delete() {
        
        $sql = 'DELETE FROM payment_methods_assigned_to_users
                WHERE id=:id AND user_id=:user_id;';

        $db = static::getDB();
        $statement = $db->prepare($sql);
        $statement->bindValue(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
        $statement->bindValue(':id', $this->id, PDO::PARAM_INT);
        return $statement->execute();
    }

 }