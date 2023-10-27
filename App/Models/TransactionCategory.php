<?php

namespace App\Models; 

use Core\Model;
use PDO;

/**
 * Model to handle the expenses categories
 */
class TransactionCategory extends Model {

    /**
     * Transaction category id in the database
     * @var int
     */
    public $id;

    /**
     * Transaction category name in the database
     * @var string
     */
    public $name;

    public function __construct($data =[]){
        foreach ($data as $key => $value) {
            $this->$key = $value;
        }
    }

}

?>