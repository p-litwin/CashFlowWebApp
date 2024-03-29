<?php

namespace App\Controllers;

use App\Controllers\Authenticated;
use App\Flash;
use App\Models\IncomeCategory;
use Core\View;

class IncomeCategories extends Authenticated{
    
    /**
     * Action to display incomes categories list
     * 
     * @return void
     */
    public function showAction()
    {
        View::renderTemplate('Categories_methods\Income_categories\show.html', );
    }

    /**
     * Action to add new income category
     * 
     * @return void
     */
    public function addAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $income_category = new IncomeCategory($_POST);
            $income_category->user_id = $this->user_id;
            if ($income_category->save()) {
                $_SESSION['incomes_categories'] = IncomeCategory::getIncomeCategoriesByUserId($this->user_id);
                Flash::addMessage('Kategoria przychodu została dodana.');
            } else {
                $this->pushFlashMessages($income_category->errors, Flash::WARNING);
            }
            $this->redirect('\income-categories');
        }
    }

    /**
     * Action to update income category
     * 
     * @return void
     */
    public function updateAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $income_category = new IncomeCategory($_POST);
            $income_category->user_id = $this->user_id;
            if ($income_category->update()) {
                $_SESSION['incomes_categories'] = IncomeCategory::getIncomeCategoriesByUserId($this->user_id);
                Flash::addMessage('Nazwa kategorii została zmieniona.');
            } else {
                Flash::addMessage('Nie udało się zmienić kategorii przychodu', Flash::WARNING);
            }
        }
        $this->redirect('\income-categories');
    }

     /**
     * Action to delete expense category from the database
     * 
     * @return void
     */
    public function deleteAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $income_category = new IncomeCategory($_POST);
            $income_category->user_id = $this->user_id;
            if ($income_category->delete()) {
                $_SESSION['incomes_categories'] = IncomeCategory::getIncomeCategoriesByUserId($this->user_id);
                Flash::addMessage('Kategoria została usunięta. Wszystkie transakcje z tej kategorii pozostały bez kategorii.');
            } else {
                Flash::addMessage('Nie udało się usunąć kategorii wydatku', Flash::WARNING);
            }
        }
        $this->redirect('\income-categories');
    }

    /**
     * Action to validate if income category already exists in database (AJAX)
     * 
     * @return void
     */
    public static function validateIncomeCategoryAction()
    {
    $is_valid = !IncomeCategory::categoryExists($_GET['name'], $_GET['ignore_id'] ?? null);
        header('Content-Type: application/json');
        echo json_encode($is_valid);
    }

    /**
     * Finds similar income categories based on the provided name and optional ignore ID.
     *
     * @return void
     */
    public static function findSimilarAction() {
        $similarCategory = IncomeCategory::getSimilarCategories($_GET['name'], $_GET['ignore_id'] ?? null);
        header('Content-Type: application/json');
        echo json_encode($similarCategory);
    }


}

?>