<?php

namespace App\Controllers;

use \Core\View;
use \App\Models\Post;

/**
 * Posts controller
 */
class Posts extends \Core\Controller {

    /**
     * Summary of index
     * @return void
     */
    public function indexAction() {
        $posts = Post::getAll();
        View::renderTemplate('Posts/index.html', ['posts'=>$posts]);
    }

    /**
     * Summary of addNew
     * @return void
     */
    public function addNewAction() {
        echo 'Hello from the addNew action in the Posts controller;';
    }

    public function editAction() {
        echo 'Hello  from the edit action in the Posts controller!';
        echo '<p>Route parameters: <pre>'.
        htmlspecialchars(print_r($this->route_params, true)) . '</pre></p>';
    }

     /**
     * Before filter - called before an action method
     * 
     * @return void
     */
    protected function before() {
        
    }

    /**
     * After filter - called after an action  method
     * @return void
     */
    protected function after() {
       
    }

}