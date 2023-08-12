<?php

namespace App\Models;

use PDOException;
use PDO;

/**
 * Post class
 */
class Post extends \Core\Model {

    /**
     * Summary of getAll
     * @return mixed
     */
    public static function getAll() {
        try {
            
            $db = static::getDB();

            $sql = "SELECT *
            FROM posts";

            $statement = $db->query($sql);

            $results = $statement->fetchAll(PDO::FETCH_ASSOC);

            return $results;

        } catch (PDOException $exception) {
            echo $exception->getMessage();
        }
    }

}

?>