<?php

namespace App\Models; 

use App\Models\TransactionCategory;
use Core\Text;
use PDO;

/**
 * Model to handle the incomes categories
 */
class IncomeCategory extends TransactionCategory {

    /**
     * Save new income category in the database
     * @return mixed
     */
    public function save()
    {

        $this->validate();

        if (empty($this->errors)) {

            $sql = "INSERT INTO incomes_category_assigned_to_users (user_id, name)
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
    public static function getIncomeCategoriesByUserId($user_id) {
        
        $sql = 'SELECT id, name
                FROM incomes_category_assigned_to_users
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
     * Copy default expenses categories for user with given id
     * @param integer $user_id Id of logged in user
     * @return void
     */
    public static function copyDefaultIncomesCategoriesByUserId($user_id) {
        
        $sql = 'INSERT INTO incomes_category_assigned_to_users (name, user_id)
                SELECT name, :user_id
                FROM incomes_category_default;';

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
        
        $sql = 'UPDATE incomes_category_assigned_to_users
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
        
        $sql = 'DELETE FROM incomes_category_assigned_to_users
                WHERE id=:id AND user_id=:user_id;';

        $db = static::getDB();
        $statement = $db->prepare($sql);
        $statement->bindValue(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
        $statement->bindValue(':id', $this->id, PDO::PARAM_INT);
        return $statement->execute();
    }

    /**
     * Delete all incomes categories assigned to logged in user
     * 
     * @param int $user_id id of the user in the database
     * @return boolean True if the the incomes categories has been deleted, false otherwise
     */
    public static function deleteAll($user_id) {
        
        $sql = 'DELETE FROM incomes_category_assigned_to_users
                WHERE user_id=:user_id';

        $db = static::getDB();
        $statement = $db->prepare($sql);
        $statement->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        return $statement->execute();

    }

    /**
     * Find income category by name
     * 
     * @param string $category_name Income category name
     * @return mixed object of the IncomeCateogry class if found in the database, false otherwise 
     */
    public static function findByName($category_name)
    {
        $sql = 'SELECT * FROM incomes_category_assigned_to_users
                WHERE name COLLATE utf8_bin = :category_name';

        $db        = static::getDB();
        $statement = $db->prepare($sql);
        $statement->bindValue(':category_name', $category_name, PDO::PARAM_STR);
        $statement->setFetchMode(PDO::FETCH_CLASS, get_called_class());
        $statement->execute();

        return $statement->fetch();
    }

    /**
     * Check if category already exists in the database for logged in user
     * @param string $category_name
     * @return bool true if category exists, false otherwise
     */
    public static function categoryExists($category_name, $ignore_id = null)
    {
        $newCategoryNormalizedName = Text::normalize($category_name);
        $categories =  $_SESSION['incomes_categories'];
        if (!$categories) {
            $categories = IncomeCategory::getIncomeCategoriesByUserId($_SESSION['user_id']);
            $_SESSION['incomes_categories'] = $categories;
        }

        foreach ($categories as $category) {
            $normalizedCategoryName = Text::normalize($category['name']);
            if ($category['id'] != $ignore_id) {
                if ($normalizedCategoryName == $newCategoryNormalizedName) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Retrieves a list of similar income categories based on a given category name.
     *
     * @param string $category_name The name of the category to find similar categories for.
     * @param int|null $ignore_id (Optional) The ID of a category to ignore during the search.
     * @return array The list of similar category names.
     */
    public static function getSimilarCategories($category_name, $ignore_id = null) {
        $newCategoryNormalizedName = Text::normalize($category_name);
        $categories = $_SESSION['incomes_categories'];
        $similarCategories = [];
        
        if (!$categories) {
            $categories = IncomeCategory::getIncomeCategoriesByUserId($_SESSION['user_id']);
            $_SESSION['incomes_categories'] = $categories;
        }

        foreach ($categories as $category) {
            if ($category['id'] != $ignore_id) {
            $normalizedCategoryName = Text::normalize($category['name']);
            similar_text($normalizedCategoryName, $newCategoryNormalizedName, $percent);
            if ($percent > 60 && $percent < 100) {
                $similarCategories[] = $category['name'];
            }   
            }
        }
        return $similarCategories;
    }

}

?>