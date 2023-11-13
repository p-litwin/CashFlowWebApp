<?php

namespace App\Models;

use Core\Model;

/**
 * Abstract model class for transaction.
 */
abstract class Transaction extends Model  {
    /**
     * Transaction id
     * @var int
     */
    public $id;
    /**
     * Logged in user id
     * 
     * @var int
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
     * Transaction category id assigned to user id
     * 
     * @var int
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
        
        if ($this->amount == '') {
            $this->errors[] = 'Pole kwota nie może być puste';
        }
        if (!floatval($this->amount)) {
            $this->errors[] = 'Nieprawidłowa wartość w polu kwota';
        }
        if ($this->amount <= 0) {
            $this->errors[] = 'Kwota musi być większa od 0';
        }
        if (strtotime($this->date) === false) {
            $this->errors[] = 'Data ma nieprawidłową wartość';
        }

        if ($this->category == '') {
            $this->errors[] = 'Wybierz kategorię przychodu';
        }
    }

}

?>