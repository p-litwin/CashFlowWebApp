<?php

namespace App\Controllers;

use App\Auth;
use App\Flash;
use Core\View;
use App\Models\IncomeCategory;
use App\Models\Income;

/**
 * Incomes controller
 */
class Incomes extends \App\Controllers\Authenticated
{

    /**
     * Add new expense
     * @return void
     */
    public function addAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $income = new Income($_POST);
            $income->user_id = $this->user->id;
            if ($income->save()) {
                Flash::addMessage('Przychód został dodany');
            } else {
                foreach ($income->errors as $error) {
                    Flash::addMessage($error, Flash::WARNING);
                }
            }
            $this->redirect($_SESSION['return_to']);
        }
        Flash::addMessage('Dane nowego przychodu nie zostały podane', Flash::WARNING);
        $this->redirect($_SESSION['return_to']);

    }

    public function updateAction()
    {

        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $income = new Income($_POST);
            $income->user_id = $this->user->userId;
        }

        if ($income->update()) {
            Flash::addMessage('Przychód został zaktualizowany');
            if (isset($_SESSION['return_to'])) {
                $this->redirect($_SESSION['return_to']);
            } else {
                $this->redirect('/transactions-list/show');
            }
        } else {
            Flash::addMessage('Wystąpił błąd. Przychód nie został zaktualizowany', Flash::WARNING);
            if (isset($_SESSION['return_to'])) {
                $this->redirect($_SESSION['return_to']);
            } else {
                $this->redirect('/transactions-list/show');
            }
        }
    }

    /**
     * Action to delete income from the database
     * 
     * @return void
     */
    public function deleteAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $income = new Income($_POST);
            $income->user_id = $this->user->userId;
            if ($income){ 
                $income->delete();
                Flash::addMessage('Przychód został usunięty pomyślnie.', Flash::SUCCESS); 
            }
            $this->redirect($_SESSION['return_to']);
        }
    }

}

?>