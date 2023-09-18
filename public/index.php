<?php
/**
 * Front controller
 * 
 * 
 */

/**
 * Composer
 */
require '../vendor/autoload.php';

/**
 * Error and Exception handling
 */
 error_reporting(E_ALL);
 set_error_handler('Core\Error::errorHandler');
 set_exception_handler('Core\Error::exceptionHandler');

 /**
 * Session
 */
 
 session_start();

/**
 * Routing
 */

$router = new Core\Router();

$router->add('', ['controller'=>'Home', 'action'=>'index']);
$router->add('login', ['controller'=>'Login', 'action'=>'new']);
$router->add('signup', ['controller'=>'Signup', 'action'=>'create']);
$router->add('logout', ['controller'=>'Login', 'action'=>'destroy']);
$router->add('password', ['controller'=>'Password', 'action'=>'forgot']);
$router->add('password/reset/{token:[\da-f]+}', ['controller'=>'Password', 'action'=>'reset']);
$router->add('signup/activate/{token:[\da-f]+}', ['controller'=>'Signup', 'action'=>'activate']);
$router->add('{controller}/{action}');
$router->add('{controller}/{id:\d+}/{action}');

$router->dispatch($_SERVER['QUERY_STRING']);

?>