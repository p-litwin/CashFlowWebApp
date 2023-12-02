<?php

namespace App\Models;

use App\Models\TransactionCategory;
use PDO;

/**
 * Model to handle the expenses categories
 */
class ExpenseCategory extends TransactionCategory
{

    /**
     * Monthly budget for expense category
     * @var float
     */
    public $budget;

    /**
     * Save new expense category in the database
     * @return mixed
     */
    public function save()
    {

        $this->validate();

        if (empty($this->errors)) {

            $sql = "INSERT INTO expenses_category_assigned_to_users (user_id, name)
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
     * Get expense categories from the database
     * @param integer $user_id Id of logged in user
     * @return array Associative array of the expense category id and expense category name
     */
    public static function getExpenseCategoriesByUserId($user_id) {
        $sql = 'SELECT id, name, budget
                FROM expenses_category_assigned_to_users
                WHERE user_id = :user_id
                ORDER BY name' ;

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

    /**
     * Update the expense category in the database
     * 
     * @return boolean True if the category has been updated, false otherwise
     */
    public function update() {
        $sql = 'UPDATE expenses_category_assigned_to_users
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
     * Delete the expense category from the database
     * 
     * @return boolean True if the category has been removed, false otherwise
     */
    public function delete() {
        $sql = 'DELETE FROM expenses_category_assigned_to_users
                WHERE id=:id AND user_id=:user_id;';

        $db = static::getDB();
        $statement = $db->prepare($sql);
        $statement->bindValue(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
        $statement->bindValue(':id', $this->id, PDO::PARAM_INT);
        return $statement->execute();
    }

    /**
     * Delete all expenses categories assigned to logged in user
     * 
     * @param int $user_id id of the user in the database
     * @return boolean True if the expenses categories has been deleted, false otherwise
     */
    public static function deleteAll($user_id) {
        $sql = 'DELETE FROM expenses_category_assigned_to_users
                WHERE user_id=:user_id';

        $db = static::getDB();
        $statement = $db->prepare($sql);
        $statement->bindValue(':user_id', $user_id, PDO::PARAM_INT);

        return $statement->execute();
    }

    /**
     * Find expense category by name
     * 
     * @param string $category_name
     * @return mixed object of the ExpenseCateogry class if found in the database, false otherwise 
     */
    public static function findByName($category_name)
    {
        $sql = 'SELECT * FROM expenses_category_assigned_to_users
                WHERE name = :category_name';

        $db        = static::getDB();
        $statement = $db->prepare($sql);
        $statement->bindValue(':category_name', $category_name, PDO::PARAM_STR);
        $statement->setFetchMode(PDO::FETCH_CLASS, get_called_class());
        $statement->execute();

        return $statement->fetch();
    }

    /**
     * Update the budget for expense category
     * 
     * @return boolean True if budget has been updated, false otherwise 
     */
    public function budgetUpdate()
    {

        $this->validateBudget();

        if (empty($this->errors)) {
            $sql = 'UPDATE expenses_category_assigned_to_users
                    SET budget = :budget
                    WHERE id=:id AND user_id=:user_id;';
            $db        = static::getDB();
            $statement = $db->prepare($sql);
            $statement->bindValue(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
            $statement->bindValue(':id', $this->id, PDO::PARAM_INT);
            $statement->bindValue(':budget', $this->budget, PDO::PARAM_STR);
            return $statement->execute();
        } else {
            return false;
        }

    }

    /**
     * Server side validation of the budget value
     * 
     * @return void
     */
    private function validateBudget()
    {

        if (!floatval($this->budget)) {
            $this->errors[] = 'Nieprawidłowa wartość w polu budżet.';
        }
        if ($this->budget <= 0) {
            $this->errors[] = 'Kwota musi być większa od 0';
        }

    }

    /**
     * Find expense category by id
     * 
     * @return mixed object of the ExpenseCategory class if found in the database, false otherwise
     */
    public static function findById($id)
    {

        $sql = 'SELECT * FROM expenses_category_assigned_to_users
                WHERE id = :id AND user_id = :user_id';

        $db        = static::getDB();
        $statement = $db->prepare($sql);
        $statement->bindValue(':id', $id, PDO::PARAM_STR);
        $statement->bindValue(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
        $statement->setFetchMode(PDO::FETCH_CLASS, get_called_class());
        $statement->execute();

        return $statement->fetch();
    }

}

?>