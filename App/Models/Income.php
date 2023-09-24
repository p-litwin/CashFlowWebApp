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
    
    /**
     * Get all incomes for the given period with cumulative values for income categories.
     * @param string $start_date starting date of the period to display balance
     * @param string $end_date ending date of the period to  display balance
     * @return array Associative array of the incomes and cumulative amount
     */
    public static function getAllIncomesForGivenPeriod($start_date, $end_date) {

        $sql = "SELECT t2.name, COALESCE(SUM(t1.amount), 0) as Total_incomes
                FROM incomes as t1
                RIGHT JOIN incomes_category_assigned_to_users AS t2
                ON t2.id = t1.income_category_assigned_to_user_id
                AND t2.user_id = :user_id AND t1.date_of_income BETWEEN :start_date AND :end_date
                GROUP BY t2.name
                ORDER  BY t2.name";

        $db        = static::getDB();
        $statement = $db->prepare($sql);

        $statement->bindValue(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
        $statement->bindValue(':start_date', $start_date, PDO::PARAM_STR);
        $statement->bindValue(':end_date', $end_date, PDO::PARAM_STR);
        $statement->execute();
        
        return $statement->fetchAll();


    }

    /**
     * Get cumulative amount of all incomes in the given period
     * @param string $start_date Start date of period
     * @param string $end_date End date of period
     * @return array Cumulative income
     */
    public static function getTotalIncomesForGivenPeriod($start_date, $end_date) {

        $sql = "SELECT SUM(amount) as Total_incomes
                FROM  incomes
                WHERE user_id = :user_id AND date_of_income BETWEEN :start_date AND :end_date;";

        $db        = static::getDB();
        $statement = $db->prepare($sql);

        $statement->bindValue(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
        $statement->bindValue(':start_date', $start_date, PDO::PARAM_STR);
        $statement->bindValue(':end_date', $end_date, PDO::PARAM_STR);
        $statement->execute();
        $statement->setFetchMode(PDO::FETCH_NUM);
        $total_income = $statement->fetch();

        if ($total_income[0] == null) {
            $total_income[0] = 0;
        }

        return $total_income;

    }

}

?>