<?php

namespace App\Models;

use App\Models\Transaction;
use PDO;

/**
 * Income model class. Class to save, edit and delete single incomes in the database.
 */
class Income extends Transaction
{

    /**
     * Save new expense to the database
     * 
     * @return boolean true if the income was succesfully written to the database, false otherwise
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
     * Update income details in the database
     * 
     * @return bool true if the income has been successfully updated, false otherwise
     */
    public function update()
    {

        $this->validate();

        if (empty($this->errors)) {

            $sql = "UPDATE incomes
                    SET income_category_assigned_to_user_id = :income_category_assigned_to_user_id,
                    amount = :amount, date_of_income = :date_of_income, income_comment = :income_comment
                    WHERE id = :id AND user_id = :user_id";

            $db        = static::getDB();
            $statement = $db->prepare($sql);
            $statement->bindValue(':user_id', $this->user_id, PDO::PARAM_INT);
            $statement->bindValue(':id', $this->id, PDO::PARAM_INT);
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
     * Delete selected income from the database
     * 
     * @return bool true if the income has been deleted sucessfully, false otherwise
     */
    public function delete() {
        
        $sql = "DELETE FROM incomes
                WHERE id = :id AND user_id = :user_id";

        $db        = static::getDB();
        $statement = $db->prepare($sql);
        $statement->bindValue(':user_id', $this->user_id, PDO::PARAM_INT);
        $statement->bindValue(':id', $this->id, PDO::PARAM_INT);

        return $statement->execute();

    }

}

?>