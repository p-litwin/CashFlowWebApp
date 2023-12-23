<?php

namespace App\Models;

use Core\Model;
use PDO;

/**
 * Model to handle the expenses categories
 */
abstract class TransactionCategory extends Model
{

    /**
     * User id
     * @var int
     */
    public $user_id;

    /**
     * Transaction category id in the database
     * @var int
     */
    public $id;

    /**
     * Transaction category name in the database
     * @var string
     */
    public $name;

    /**
     * Validation errors
     * @var array
     */
    public $errors = [];

    /**
     * Constructor for transaction category class
     * 
     * @param array $data Assosciative array object properties
     */
    public function __construct($data = [])
    {
        foreach ($data as $key => $value) {
            $this->$key = $value;
        }
    }

    /**
     * Server side validation of the category name
     * 
     * @return void
     */
    protected function validate()
    {
        if (empty($this->name)) {
            $this->errors[] = "Kategoria nie może być pusta";
        }

        if (strlen($this->name) > 50) {
            $this->errors[] = 'Kategoria może mieć maksymalnie 50 znaków';
        }

        if (static::categoryExists($this->name)) {
            $this->errors[] =  'Kategoria już istnieje w bazie';
        }
    }

    /**
     * Check if category already exists in the database for logged in user
     * @param string $category_name
     * @return bool true if category exists, false otherwise
     */
    public static function categoryExists($category_name, $ignore_id = null)
    {
        $newCategoryNormalized = static::normalize($category_name);
        $categories =  $_SESSION['expenses_categories'];
        
        if (!$categories) {
            $categories = ExpenseCategory::getExpenseCategoriesByUserId($_SESSION['user_id']);
            $_SESSION['expenses_categories'] = $categories;
        }

        foreach ($categories as $category) {
            $normalizedCategory = static::normalize($category['name']);
            if ($category['id'] != $ignore_id) {
                if ($normalizedCategory == $newCategoryNormalized) {
                    return true;
                }
            }
        }
        return false;
    }

    abstract public static function findByName($category_name);

    public static function normalize($category)
    {
        $stripped = static::removeSpaces($category);
        $lower = static::toLower($stripped);
        return $lower;
    }

    public static function removeSpaces($category)
    {
        $stripped = str_replace(" ", "", $category);
        return $stripped;
    }

    public static function  toLower($category)
    {
        $lower = strtolower($category);
        return $lower;
    }
}
