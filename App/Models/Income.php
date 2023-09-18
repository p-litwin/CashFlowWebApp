<?php

namespace App\Models;

use Core\Model;
use PDO;

class Income extends Model
{

    /**
     * Logged in user id
     * 
     * @var integer
     */
    public $user_id;

    /**
     * Expense amount with dot or comma
     * 
     * @var float
     */
    public $amount;

    /**
     * Expense date in format 'Y-m-d'
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
     * Expense comment
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
     * @param array $income_data Associative array containing the expense data
     */
    public function __construct($income_data = [])
    {
        foreach ($income_data as $key => $value) {
            $this->$key = $value;
        }
    }

    /**
     * Save new expense to the database
     * 
     * @return boolean false if the expense was succesfully written to the database, fals otherwise
     */
    public function save()
    {

        $this->validate();

        if (empty($this->errors)) {

            $sql = "INSERT INTO incomes (user_id, income_category_assigned_to_user_id, amount, date_of_income, income_comment)
                VALUES (:user_id, :income_category_assigned_to_user_id, :amount, :date_of_income, :income_comment)";

            $db        = static::getDB();
            $statement = $db->prepare($sql);

            $statement->bindValue(':user_id', $this->user_id, PDO::PARAM_INT);
            $statement->bindValue(':income_category_assigned_to_user_id', $this->category, PDO::PARAM_INT);
            $statement->bindValue(':amount', $this->amount, PDO::PARAM_STR);
            $statement->bindValue(':date_of_income', $this->date, PDO::PARAM_STR);
            $statement->bindValue(':income_comment', $this->comment, PDO::PARAM_STR);


            return $statement->execute();

        } else {

            return false;

        }
    }

    /**
     * Server-side validation of the values passed to the Expense object
     * 
     * @return void
     */
    private function validate()
    {
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