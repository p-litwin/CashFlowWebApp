<?php

namespace App\Controllers;

use Core\View;

/**
 * Items controller (example)
 */
class Items extends Authenticated {
    
    /**
     * Items index
     * @return void
     */
    public function indexAction() {  

       View::renderTemplate('Items/index.html');
    
    }

    /**
     * New item
     * @return void
     */
    public function newAction() {  

        echo "new action";
     
     }

     /**
      * Show items
      * @return void
      */
     public function showAction() {  

        echo "show action";
     
     }

}

?>