<?php

namespace App\Controllers;


use Core\View;
use App\Models\ExpenseCategory;
use App\Flash;

class Settings extends Authenticated {
    public function expenseCategoriesAction() {
        View::renderTemplate('Settings\expense-categories.html');
    }

    public function expenseCategoryUpdateAction() {
        if ($_SERVER['REQUEST_METHOD']=='POST') {
        $expense_category = new ExpenseCategory($_POST);
            if ($expense_category->update()){
                Flash::addMessage('Nazwa kategorii została zmieniona.');
            } else {
                Flash::addMessage('Nie udało się zmienić kategorii wydatku', Flash::WARNING);
            }
        }
        $this->redirect('\settings\expense-categories');
    }

    public function incomesCategoriesAction() {
        View::renderTemplate('Settings\incomes-categories.html',);
    }
}