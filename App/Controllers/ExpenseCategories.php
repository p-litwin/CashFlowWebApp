<?php

namespace App\Controllers;

use App\Controllers\Authenticated;
use App\Flash;
use App\Models\ExpenseCategory;
use Core\View;

class ExpenseCategories extends Authenticated
{

    /**
     * Action to add new expense category
     * 
     * @return void
     */
    public function addAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $expense_category = new ExpenseCategory($_POST);
            $expense_category->user_id = $this->user_id;
            if ($expense_category->save()) {
                $_SESSION['expenses_categories'] = ExpenseCategory::getExpenseCategoriesByUserId($this->user_id);
                Flash::addMessage('Kategoria wydatku została dodana.');
            } else {
                $this->pushFlashMessages($expense_category->errors, Flash::WARNING);
            }
            $this->redirect('/expense-categories');
        }
    }

    /**
     * Action to display expenses categories list
     * 
     * @return void
     */
    public function showAction()
    {
        View::renderTemplate('Categories_methods/Expense_categories/show.html');
    }

    /**
     * Action to update expense category
     * 
     * @return void
     */
    public function updateAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $expense_category = new ExpenseCategory($_POST);
            $expense_category->user_id = $this->user_id;
            if ($expense_category->update()) {
                $_SESSION['expenses_categories'] = ExpenseCategory::getExpenseCategoriesByUserId($this->user_id);
                Flash::addMessage('Kategoria wydatku została zaktualizowana.');
            } else {
                Flash::addMessage('Nie udało się zmienić kategorii wydatku', Flash::WARNING);
            }
        }
        $this->redirect('\expense-categories');
    }

    /**
     * Action to delete expense category from the database
     * 
     * @return void
     */
    public function deleteAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $expense_category = new ExpenseCategory($_POST);
            $expense_category->user_id = $this->user_id;
            if ($expense_category->delete()) {
                $_SESSION['expenses_categories'] = ExpenseCategory::getExpenseCategoriesByUserId($this->user_id);
                Flash::addMessage('Kategoria została usunięta. Wszystkie transakcje z tej kategorii pozostały bez kategorii.');
            } else {
                Flash::addMessage('Nie udało się usunąć kategorii wydatku', Flash::WARNING);
            }
        }
        $this->redirect('\expense-categories');
    }

    /**
     * Action to validate if expense category already exists in database (AJAX)
     * 
     * @return void
     */
    public static function validateExpenseCategoryAction()
    {
        $is_valid = !ExpenseCategory::categoryExists($_GET['name'], $_GET['ignore_id'] ?? null);
        header('Content-Type: application/json');
        echo json_encode($is_valid);
    }

    public static function categoryBudgetAction() {
        $budget = ExpenseCategory::getBudgetForCategory($_GET['id']);
        header('Content-Type: application/json');
        echo json_encode($budget);
    }

    public static function findSimilarAction() {
        $similarCategory = ExpenseCategory::getSimilarCategories($_GET['name'], $_GET['ignore_id'] ?? null);
        header('Content-Type: application/json');
        echo json_encode($similarCategory);
    }

}

?>