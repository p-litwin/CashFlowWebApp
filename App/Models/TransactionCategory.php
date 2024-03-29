<?php

namespace App\Models;

use Core\Model;
use Core\Text;
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

    abstract public static function categoryExists($category_name, $ignore_id = null);

    abstract public static function findByName($category_name);

    
}
