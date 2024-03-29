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

        $sql = "SELECT ecat.name as name, COALESCE(SUM(exp.amount),0) AS Total_expenses
                FROM expenses_category_assigned_to_users as ecat
                left JOIN expenses as exp
                ON ecat.id = exp.expense_category_assigned_to_user_id and exp.date_of_expense BETWEEN :start_date AND :end_date
                WHERE ecat.user_id = :user_id
                GROUP BY ecat.name
                UNION
                SELECT NULL, COALESCE(sum(exp1.amount),0) as Total_expenses
                FROM expenses as exp1
                WHERE exp1.user_id =:user_id and exp1.expense_category_assigned_to_user_id is NULL and exp1.date_of_expense BETWEEN :start_date AND :end_date";

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

        $sql = "SELECT icat.name AS name, COALESCE(SUM(inc.amount),0) AS Total_incomes
                FROM incomes_category_assigned_to_users AS icat
                LEFT JOIN incomes AS inc
                ON icat.id = inc.income_category_assigned_to_user_id and inc.date_of_income BETWEEN :start_date AND :end_date
                WHERE icat.user_id = :user_id
                GROUP BY icat.name
                UNION
                SELECT NULL, COALESCE(SUM(inc1.amount),0) AS Total_incomes
                FROM incomes AS inc1
                WHERE inc1.user_id =:user_id AND inc1.income_category_assigned_to_user_id IS NULL AND inc1.date_of_income BETWEEN :start_date AND :end_date";

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
        
        
        $sql = "SELECT name, date, comment, amount
                FROM
                (SELECT expense_category_assigned_to_user_id as category, date_of_expense as date, expense_comment as comment, amount
                FROM expenses
                WHERE user_id = :user_id
                UNION
                SELECT income_category_assigned_to_user_id as category, date_of_income as date, income_comment as comment, amount
                FROM incomes
                WHERE user_id = :user_id
                ORDER BY date DESC) as list_with_category_ids
                LEFT JOIN
                (SELECT *
                FROM expenses_category_assigned_to_users
                WHERE user_id = :user_id
                UNION
                SELECT *
                FROM incomes_category_assigned_to_users
                WHERE user_id = :user_id) as all_categories
                ON all_categories.id = list_with_category_ids.category
                LIMIT 8;";

        $db        = static::getDB();
        $statement = $db->prepare($sql);

        $statement->bindValue(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
        $statement->execute();
        
        return $statement->fetchAll();
        
    }

    /**
     * Get number of transactions for logged in user
     * @return integer number of transactions or false if user has 0 transactions
     */
    public static function getTransactionsCount() {
        
        $sql = "SELECT COUNT(amount) as transactions
        FROM
        (SELECT expense_category_assigned_to_user_id as category, date_of_expense as date, expense_comment as comment, amount
        FROM expenses
        WHERE user_id = :user_id
        UNION
        SELECT income_category_assigned_to_user_id as category, date_of_income as date, income_comment as comment, amount
        FROM incomes
        WHERE user_id = :user_id) AS transacions_list;";

        $db        = static::getDB();
        $statement = $db->prepare($sql);

        $statement->bindValue(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
        $statement->setFetchMode(PDO::FETCH_NUM);
        $statement->execute();
        
        $transactions = $statement->fetch();
        
        if ($transactions[0] == null) {
            $transactions[0] = 0;
        }

        return $transactions[0];
    
    }

    /**
     * Get paginated transactions list
     * @param integer $offset offset for query
     * @param integer $limit number of transactions to display on single page
     * @return mixed - transactions of the logged in user or false if there are no transactions in the database
     */
    public static function getTransactionsWithPagination($offset, $limit) {
        
        
        $sql = "SELECT transaction_id, all_categories.id as category_id, list_with_category_ids.payment_method, payment_methods.name, all_categories.name, date, comment, amount, type
                FROM
                (SELECT id as transaction_id, expense_category_assigned_to_user_id as category, payment_method_assigned_to_user_id as payment_method, date_of_expense as date, expense_comment as comment, amount, 'expense' as type
                FROM expenses 
                WHERE user_id = :user_id
                UNION
                SELECT id as transaction_id, income_category_assigned_to_user_id as category, null as payment_method, date_of_income as date, income_comment as comment, amount, 'income' as type
                FROM incomes
                WHERE user_id = :user_id
                ORDER BY date DESC, transaction_id DESC) as list_with_category_ids
                LEFT JOIN
                (SELECT id, user_id, name, 'expense' as transaction_type
                FROM expenses_category_assigned_to_users
                WHERE user_id = :user_id
                UNION
                SELECT id, user_id, name, 'income' as transaction_type
                FROM incomes_category_assigned_to_users
                WHERE user_id = :user_id) as all_categories
                ON all_categories.id = list_with_category_ids.category AND all_categories.transaction_type = list_with_category_ids.type
                LEFT JOIN
                (SELECT id, user_id, name
                FROM payment_methods_assigned_to_users) as payment_methods
                ON payment_methods.id = list_with_category_ids.payment_method   
                LIMIT :limit
                OFFSET :offset;";

        $db        = static::getDB();
        $statement = $db->prepare($sql);

        $statement->bindValue(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
        $statement->bindValue(':offset', $offset, PDO::PARAM_INT);
        $statement->bindValue(':limit', $limit, PDO::PARAM_INT);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->execute();
        
        return $statement->fetchAll();

    }

    /**
     * Get total amount of expenses for selected month in selected category
     * @param integer $category_id Expesne category id
     * @param integer $year Full year number in rrrr format eg. 2023
     * @param integer $month Month number 1 - 12
     * @return mixed Total amount of expenses for selected category, null if no expenses were found
     */
    public static function getTotalExpensesForCategoryInSelectedMonth($category_id, $year, $month, $expense_to_ignore = null) {
        $sql = "SELECT SUM(amount) as Total
                FROM  expenses
                WHERE user_id = :user_id AND expense_category_assigned_to_user_id = :category_id
                AND date_of_expense AND MONTH(date_of_expense) = :month AND YEAR(date_of_expense) = :year";

        if ($expense_to_ignore) {
            $sql .= " AND id != :expense_to_ignore";
        }

        $db        = static::getDB();
        $statement = $db->prepare($sql);
        $statement->bindValue(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
        $statement->bindValue(':category_id', $category_id, PDO::PARAM_INT);
        $statement->bindValue(':month', $month, PDO::PARAM_INT);
        $statement->bindValue(':year', $year, PDO::PARAM_INT);
        if ($expense_to_ignore) {
            $statement->bindValue(':expense_to_ignore', $expense_to_ignore, PDO::PARAM_INT);
        }
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->execute();
        return $statement->fetch();
    }


}

?>