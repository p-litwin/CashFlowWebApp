<?php

namespace App\Controllers;

use App\Paginator;
use \Core\View;
use App\Models\Transactions;
use App\Config;

/**
 * Controller to deliver the transactions list to the user
 */
class TransactionsList extends Authenticated {
    
    /**
     * Show the transactions list for the logged in user
     * @return void
     */
    public function showAction() {

        
        if (!isset($this->route_params['page'])) {
            $page = 1;
        } else {
            $page = $this->route_params['page'];
        }
        $transactions_count = Transactions::getTransactionsCount();
        $paginator = new Paginator($page, Config::TRANSACTIONS_PER_PAGE, $transactions_count);

        $transactions = Transactions::getTransactionsWithPagination($paginator->offset, $paginator->limit);
        
        View::renderTemplate('TransactionsList/show.html', [
            'transactions' => $transactions,
            'page' => $page,
            'next_page' => $paginator->next,
            'previous_page' => $paginator->previous,
            'last_page' => $paginator->total_pages
        ]);
    }   

}