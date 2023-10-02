<?php

namespace App\Models;

use App\Models\Transaction;
use PDO;

class Expense extends Transaction {

    /**
     * Payment method id assigned to user id
     * 
     * @var integer
     */
    public $payment_method;

    /**
     * Save new expense to the database
     * 
     * @return boolean true if the expense was succesfully written to the database, false otherwise
     */
    public function save()
    {

        $this->validate();
        $this->validatePaymentMethod();

        if (empty($this->errors)) {

            $sql = "INSERT INTO expenses (user_id, expense_category_assigned_to_user_id, payment_method_assigned_to_user_id, amount, date_of_expense, expense_comment)
                VALUES (:user_id, :expense_category_assigned_to_user_id, :payment_method_assigned_to_user_id, :amount, :date_of_expense, :expense_comment)";

            $db        = static::getDB();
            $statement = $db->prepare($sql);

            $statement->bindValue(':user_id', $this->user_id, PDO::PARAM_INT);
            $statement->bindValue(':expense_category_assigned_to_user_id', $this->category, PDO::PARAM_INT);
            $statement->bindValue(':payment_method_assigned_to_user_id', $this->payment_method, PDO::PARAM_INT);
            $statement->bindValue(':amount', $this->amount, PDO::PARAM_STR);
            $statement->bindValue(':date_of_expense', $this->date, PDO::PARAM_STR);
            $statement->bindValue(':expense_comment', $this->comment, PDO::PARAM_STR);


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
    protected function validatePaymentMethod()
    {

        if ($this->payment_method == '') {
            $this->errors[] = 'Wybierz metodę płatności';
        }

    }

    /**
     * Get all expenses for the given period with cumulative values for expense categories.
     * @param string $start_date starting date of the period to display balance
     * @param string $end_date ending date of the period to  display balance
     * @return array Associative array of the expenses and cumulative amount
     */
    public static function getAllExpensesForGivenPeriod($start_date, $end_date) {

        $sql = "SELECT user_categories.name, COALESCE(SUM(expenses.amount),0) as Total_expenses
                FROM
                (SELECT *
                FROM expenses_category_assigned_to_users as ecatu
                WHERE ecatu.user_id = :user_id) as user_categories
                LEFT JOIN expenses
                ON user_categories.id = expenses.expense_category_assigned_to_user_id AND expenses.date_of_expense BETWEEN :start_date AND :end_date
                GROUP BY user_categories.name
                ORDER BY user_categories.name";

        $db        = static::getDB();
        $statement = $db->prepare($sql);

        $statement->bindValue(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
        $statement->bindValue(':start_date', $start_date, PDO::PARAM_STR);
        $statement->bindValue(':end_date', $end_date, PDO::PARAM_STR);
        $statement->execute();
        
        return $statement->fetchAll();


    }

    /**
     * Summary of getTotalExpensesForGivenPeriod
     * @param string $start_date Start date of period
     * @param string $end_date End date of period
     * @return array Associative array
     */
    public static function getTotalExpensesForGivenPeriod($start_date, $end_date) {

        $sql = "SELECT SUM(amount) as Total_expenses
                FROM  expenses
                WHERE user_id = :user_id AND date_of_expense BETWEEN :start_date AND :end_date;";

        $db        = static::getDB();
        $statement = $db->prepare($sql);

        $statement->bindValue(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
        $statement->bindValue(':start_date', $start_date, PDO::PARAM_STR);
        $statement->bindValue(':end_date', $end_date, PDO::PARAM_STR);
        $statement->execute();
        $statement->setFetchMode(PDO::FETCH_NUM);
        $total_expense = $statement->fetch();

        if ($total_expense[0] == null) {
            $total_expense[0] = 0;
        }

        return $total_expense;



    }

}


?>