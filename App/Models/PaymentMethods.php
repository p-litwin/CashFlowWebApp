<?php

namespace App\Models; 

use Core\Model;
use PDO;

/**
 * Model to handle the payment methods
 */

 class PaymentMethods extends Model {

    /**
     * Get payment methods from the database
     * @param integer $user_id Id of logged in user
     * @return array Associative array of the payment method id and payment method name
     */
    public static function getPaymentMethodsByUserId($user_id) {
        
        $sql = 'SELECT id, name
                FROM payment_methods_assigned_to_users
                WHERE user_id = :user_id';

        $db = static::getDB();
        $statement = $db->prepare($sql);
        $statement->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->execute();

        return $statement->fetchAll();
    }

 }