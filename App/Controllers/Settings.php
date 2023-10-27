<?php

namespace App\Controllers;


use App\Models\IncomeCategory;
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

    public function expenseCategoryDeleteAction() {
        if ($_SERVER['REQUEST_METHOD']=='POST') {
        $expense_category = new ExpenseCategory($_POST);
            if ($expense_category->delete()){
                Flash::addMessage('Kategoria została usunięta. Wszystkie transakcje z tej kategorii pozostały bez kategorii.');
            } else {
                Flash::addMessage('Nie udało się usunąć kategorii wydatku', Flash::WARNING);
            }
        }
        $this->redirect('\settings\expense-categories');
    }

    public function incomeCategoriesAction() {
        View::renderTemplate('Settings\income-categories.html',);
    }

    public function incomeCategoryUpdateAction() {
        if ($_SERVER['REQUEST_METHOD']=='POST') {
        $income_category = new IncomeCategory($_POST);
            if ($income_category->update()){
                Flash::addMessage('Nazwa kategorii została zmieniona.');
            } else {
                Flash::addMessage('Nie udało się zmienić kategorii przychodu', Flash::WARNING);
            }
        }
        $this->redirect('\settings\income-categories');
    }

    public function incomeCategoryDeleteAction() {
        if ($_SERVER['REQUEST_METHOD']=='POST') {
        $income_category = new IncomeCategory($_POST);
            if ($income_category->delete()){
                Flash::addMessage('Kategoria została usunięta. Wszystkie transakcje z tej kategorii pozostały bez kategorii.');
            } else {
                Flash::addMessage('Nie udało się usunąć kategorii wydatku', Flash::WARNING);
            }
        }
        $this->redirect('\settings\income-categories');
    }
}