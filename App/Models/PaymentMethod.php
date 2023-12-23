<?php

namespace App\Models;

use Core\Model;
use Core\Text;
use PDO;

/**
 * Model to handle the payment methods
 */

class PaymentMethod extends Model
{
    
    public $user_id;
    
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
     * Validation errors
     * @var array
     */
    public $errors = [];

    /**
     * Payment method object constructor
     * 
     * @param array $data Associative array containing the payment method data
     */
    public function __construct($data = [])
    {
        foreach ($data as $key => $value) {
            $this->$key = $value;
        }
    }

    /**
     * Save new payment method in the database
     * @return mixed
     */
    public function save()
    {

        $this->validate();

        if (empty($this->errors)) {

            $sql = "INSERT INTO payment_methods_assigned_to_users (user_id, name)
                VALUES (:user_id, :name)";

            $db        = static::getDB();
            $statement = $db->prepare($sql);

            $statement->bindValue(':user_id', $this->user_id, PDO::PARAM_INT);
            $statement->bindValue(':name', $this->name, PDO::PARAM_STR);

            return $statement->execute();

        } else {

            return false;

        }
    }

    /**
     * Server side validation of the category name
     * 
     * @return void
     */
    private function validate()
    {
        if (empty($this->name)){
            $this->errors[] = "Metoda płatności nie może być pusta";
        }

        if (strlen($this->name) > 50) {
            $this->errors[] = 'Nazwa metody płatności może mieć maksymalnie 50 znaków';
        }
        
        if (static::methodExists($this->name)) {
            $this->errors[] =  'Metoda płatności już istnieje w bazie';
        }
    }

    /**
     * Get payment methods from the database
     * @param integer $user_id Id of logged in user
     * @return array Associative array of the payment method id and payment method name
     */
    public static function getPaymentMethodsByUserId($user_id)
    {

        $sql = 'SELECT id, name
                FROM payment_methods_assigned_to_users
                WHERE user_id = :user_id
                ORDER BY name';

        $db        = static::getDB();
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
    public static function copyDefaultPaymentMethodsByUserId($user_id)
    {

        $sql = 'INSERT INTO payment_methods_assigned_to_users (name, user_id)
                SELECT name, :user_id
                FROM payment_methods_default;';

        $db        = static::getDB();
        $statement = $db->prepare($sql);
        $statement->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $statement->execute();

    }

    /**
     * Update the payment method in the database
     * 
     * @return boolean True if the payment method has been updated, false otherwise
     */
    public function update()
    {

        $sql = 'UPDATE payment_methods_assigned_to_users
                SET name = :name
                WHERE id=:id AND user_id=:user_id;';

        $db        = static::getDB();
        $statement = $db->prepare($sql);
        $statement->bindValue(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
        $statement->bindValue(':id', $this->id, PDO::PARAM_INT);
        $statement->bindValue(':name', $this->name, PDO::PARAM_STR);
        return $statement->execute();
    }

    /**
     * Delete the payment method from the database
     * 
     * @return boolean True if the payment method has been removed, false otherwise
     */
    public function delete()
    {

        $sql = 'DELETE FROM payment_methods_assigned_to_users
                WHERE id=:id AND user_id=:user_id;';

        $db        = static::getDB();
        $statement = $db->prepare($sql);
        $statement->bindValue(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
        $statement->bindValue(':id', $this->id, PDO::PARAM_INT);
        return $statement->execute();
    }

    /**
     * Delete all payment methods assigned to logged in user
     * 
     * @param int $user_id id of the user in the database
     * @return boolean True if the payment methods has been deleted, false otherwise
     */
    public static function deleteAll($user_id)
    {

        $sql = 'DELETE FROM payment_methods_assigned_to_users
                WHERE user_id=:user_id;';

        $db        = static::getDB();
        $statement = $db->prepare($sql);
        $statement->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        return $statement->execute();
    }

    /**
     * Check if the payment method exists in the database
     * 
     * @param string $method_name name of the payment method
     * @return bool true if the payment method exists, false otherwise
     */
    public static function methodExists($method_name, $ignore_id = null) {
        
        $newMethodNameNormalized = Text::normalize($method_name);
        $methods =  $_SESSION['payment_methods'];
        if (!$methods) {
            $methods = PaymentMethod::getPaymentMethodsByUserId($_SESSION['user_id']);
            $_SESSION['payment_methods'] = $methods;
        }

        foreach ($methods as $method) {
            $normalizedMethodName = Text::normalize($method['name']);
            if ($method['id'] != $ignore_id) {
                if ($normalizedMethodName == $newMethodNameNormalized) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Find payment method in the databse by name
     * 
     * @param string $method_name Name of the payment method
     * @return mixed object of the PaymentMethod class if the method exists, false otherwise.
     */
    public static function findByName($method_name)
    {
        $sql = 'SELECT * FROM payment_methods_assigned_to_users
                WHERE name COLLATE utf8_bin = :category_name';

        $db        = static::getDB();
        $statement = $db->prepare($sql);
        $statement->bindValue(':category_name', $method_name, PDO::PARAM_STR);
        $statement->setFetchMode(PDO::FETCH_CLASS, get_called_class());
        $statement->execute();

        return $statement->fetch();
    }

}