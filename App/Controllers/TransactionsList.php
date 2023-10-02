<?php

namespace App\Controllers;

use \Core\View;
use App\Models\Transactions;

/**
 * Controller to deliver the transactions list to the user
 */
class TransactionsList extends Authenticated {
    
    /**
     * Show the transactions list for the logged in user
     * @return void
     */
    public function showAction() {
        $transactions = Transactions::getAllTransactions();
        
        View::renderTemplate('TransactionsList/show.html', [
            'transactions' => $transactions
        ]);
    }

}