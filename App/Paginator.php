<?php

namespace App;

/**
 * Paginator
 * 
 * Data to select paginated records from the database 
 */

 class Paginator {
    /**
     * Number of records to be displayed
     * @var integer
     */
    public $limit;

    /**
     * First record to be displayed
     * @var integer
     */
    public $offset;

    /**
     * Number of previous page
     * @var integer
     */
    public $previous;

    /**
     * Number of next page
     * @var integer
     */
    public $next;

    /**
     * Current page
     * @var integer
     */
    public $current_page;

    /**
     * Total pages number
     * @var integer
     */
    public $total_pages;

    /**
     * Constructor
     * 
     * @param integer $page Number of page
     * @param integer $records_per_page Number of records per page
     * 
     * @return void
     */


     public function __construct($page, $records_per_page, $total_records) {
        
        $this->limit = $records_per_page;
        
        $page = filter_var($page, FILTER_VALIDATE_INT, ['options' => ['default' => 1, 'min_range' => 1]]);
       
        $this->current_page = $page;
        
        $this->offset = $records_per_page * ($page - 1);

        $this->total_pages = ceil($total_records / $records_per_page);

        if ($page < $this->total_pages) {
            $this->next = $page + 1;
        }
        
        if ($page > 1) {
            $this->previous = $page - 1;
        }
    }
    
}

?>