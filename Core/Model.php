<?php

namespace Core;

use PDO;
use App\Config;

/**
 * Base Model class
 */
abstract class Model
{

    /**
     * Get the PDO database connection
     * @return mixed
     */
    protected static function getDB(){

        static $db = null;

        if ($db === null) {
            try {
                
                $dsn = 'mysql:host=' . Config::DB_HOST . ';dbname=' . Config::DB_NAME . ';charset=utf8';
                $db = new PDO($dsn, Config::DB_USER, Config::DB_PASS);
                $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (\PDOException $e) {
                throw new \Exception($e->getMessage());
            }
        }

        return $db;

    }


}


?>