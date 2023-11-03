<?php

namespace App\Models;

use App\Models\Transaction;
use PDO;

/**
 * Expense model class. Class to save, edit and delete single expenses in the database.
 */
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

    public function update()
    {

        $this->validate();
        $this->validatePaymentMethod();

        if (empty($this->errors)) {

            $sql = "UPDATE expenses
                    SET expense_category_assigned_to_user_id = :expense_category_assigned_to_user_id, payment_method_assigned_to_user_id = :payment_method_assigned_to_user_id,
                    amount = :amount, date_of_expense = :date_of_expense, expense_comment = :expense_comment
                    WHERE id = :id AND user_id = :user_id";

            $db        = static::getDB();
            $statement = $db->prepare($sql);
            $statement->bindValue(':user_id', $this->user_id, PDO::PARAM_INT);
            $statement->bindValue(':id', $this->id, PDO::PARAM_INT);
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
     * Delete selected expense from the database
     * 
     * @return bool true if the income has been deleted sucessfully, false otherwise
     */
    public function delete() {
        
        $sql = "DELETE FROM expenses
                WHERE id = :id AND user_id = :user_id";

        $db        = static::getDB();
        $statement = $db->prepare($sql);
        $statement->bindValue(':user_id', $this->user_id, PDO::PARAM_INT);
        $statement->bindValue(':id', $this->id, PDO::PARAM_INT);

        return $statement->execute();

    }
    
    /**
     * Delete all expenses assigned to logged in user
     * 
     * @param int $user_id id of the user in the database
     * @return boolean True if the expenses has been deleted, false otherwise
     */
    public static function deleteAll($user_id) {
        
        $sql = "DELETE FROM expenses
                WHERE user_id = :user_id";

        $db        = static::getDB();
        $statement = $db->prepare($sql);
        $statement->bindValue(':user_id', $user_id, PDO::PARAM_INT);

        return $statement->execute();

    }

}


?>