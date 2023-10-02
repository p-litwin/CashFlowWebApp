<?php

namespace App\Models;

use Core\Model;
use PDO;

/**
 * Model to manipulate the transactions list
 */
class Transactions extends Model {

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

    /**
     * Get all incomes for the given period with cumulative values for income categories.
     * @param string $start_date starting date of the period to display balance
     * @param string $end_date ending date of the period to  display balance
     * @return array Associative array of the incomes and cumulative amount
     */
    public static function getAllIncomesForGivenPeriod($start_date, $end_date) {

        $sql = "SELECT user_categories.name, COALESCE(SUM(incomes.amount),0) as Total_incomes
                FROM
                (SELECT *
                FROM incomes_category_assigned_to_users as icatu
                WHERE icatu.user_id = :user_id) as user_categories
                LEFT JOIN incomes
                ON user_categories.id = incomes.income_category_assigned_to_user_id AND incomes.date_of_income BETWEEN :start_date AND :end_date
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

    /**
     * Get all transactions for logged in user
     * @return mixed Associative array of all the transactions (incomes and expenses) for the logged in user
     * If no transactions found false. 
     */
    public static function getAllTransactions() {
        
        
        $sql = "SELECT expense_category_assigned_to_user_id as category, date_of_expense as date, expense_comment as comment, amount
                FROM expenses
                WHERE user_id = :user_id
                UNION
                SELECT income_category_assigned_to_user_id as category, date_of_income as date, income_comment as comment, amount
                FROM incomes
                WHERE user_id = :user_id
                ORDER BY date DESC";

        $db        = static::getDB();
        $statement = $db->prepare($sql);

        $statement->bindValue(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
        $statement->execute();
        
        return $statement->fetchAll();
        
        
    }

}

?>