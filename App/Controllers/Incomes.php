<?php

namespace App\Controllers;

use App\Flash;
use App\Models\User;
use Core\View;
use App\Models\IncomesCategories;
use App\Models\Income;

/**
 * Incomes controller
 */
class Incomes extends \App\Controllers\Authenticated {

    /**
     * Display form to get the data of new expense from the users
     * @return void
     */
    public function newAction() {
        $_SESSION['incomes_categories'] = IncomesCategories::getIncomesCategoriesByUserId($_SESSION['user_id']);
        
        
        View::renderTemplate('\Income\new.html', [
                'incomes_categories'=> $_SESSION['incomes_categories']
            ]);
    }

    /**
     * Add new expense
     * @return void
     */
    public function addAction() {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $income = new Income($_POST);
        
            if ($income->save()){
                Flash::addMessage('Przychód został dodany');
                View::renderTemplate('\Income\new.html', [
                    'income'=>$income,
                    'incomes_categories'=> $_SESSION['incomes_categories']
                ]);
            }  else {
                foreach ($income->errors as $error) {
                    Flash::addMessage($error, Flash::WARNING);
                }
                View::renderTemplate('\Income\new.html', [
                    'income'=>$income,
                    'incomes_categories'=> $_SESSION['incomes_categories']
                ]);
            }
        } else {
            $this->redirect("/incomes/new");
        }
    
    }

}

?>