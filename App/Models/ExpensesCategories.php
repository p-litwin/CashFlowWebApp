<?php

namespace App\Models; 

use Core\Model;
use PDO;

/**
 * Model to handle the expenses categories
 */
class ExpensesCategories extends Model {

    /**
     * Get expense categories from the database
     * @param integer $user_id Id of logged in user
     * @return array Associative array of the expense category id and expense category name
     */
    public static function getExpensesCategoriesByUserId($user_id) {
        
        $sql = 'SELECT id, name
                FROM expenses_category_assigned_to_users
                WHERE user_id = :user_id';

        $db = static::getDB();
        $statement = $db->prepare($sql);
        $statement->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->execute();

        return $statement->fetchAll();
    }

    /**
     * Copy default expenses categories for user with given id
     * @param integer $user_id Id of logged in user
     * @return void
     */
    public static function copyDefaultExpensesCategoriesByUserId($user_id) {
        
        $sql = 'INSERT INTO expenses_category_assigned_to_users (name, user_id)
                SELECT name, :user_id
                FROM expenses_category_default;';

        $db = static::getDB();
        $statement = $db->prepare($sql);
        $statement->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $statement->execute();

    }

}

?>