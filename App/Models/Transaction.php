<?php

namespace App\Models;

use Core\Model;

abstract class Transaction extends Model  {
    /**
     * Logged in user id
     * 
     * @var integer
     */
    public $user_id;

    /**
     * Transaction amount with dot or comma
     * 
     * @var float
     */
    public $amount;

    /**
     * Transaction date in format 'Y-m-d'
     * 
     * @var string
     */
    public $date;

    /**
     * Expense category id assigned to user id
     * 
     * @var integer
     */
    public $category;

    /**
     * Transaction comment
     * 
     * @var string
     */
    public $comment;

    /**
     * Server-side validation errors
     * 
     * @var array
     */
    public $errors = [];

    /**
     * Constructor of the Expense model class
     * 
     * @param array $transaction_data Associative array containing the transaction data
     */
    public function __construct($transaction_data = [])
    {
        foreach ($transaction_data as $key => $value) {
            $this->$key = $value;
        }
    }

    /**
     * Save new transaction in the database
     * @return void
     */
    abstract public function save();
    /**
     * Validate the data before saving the transaction into database
     * @return void
     */
    protected function validate() {
        
    }

}

?>