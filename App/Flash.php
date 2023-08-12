<?php

namespace App;

/**
 * Flash notification messages: messages for one-time display using  the session
 * for storage between requests.
 */
class Flash {

    /**
     * Success message type
     * 
     * @var string
     */
Const SUCCESS = 'success';

 /**
     * Info message type
     * 
     * @var string
     */
    Const INFO = 'info';

     /**
     * Warning message type
     * 
     * @var string
     */
Const WARNING = 'warning';



/**
 * Summary of addMessage
 * 
 * @param string $message The message content
 * @param string $type The message type
 * 
 * @return void
 */
public static function addMessage($message, $type = 'success') {
    if (! isset($_SESSION['flash_notification'])) {
        $_SESSION['flash_notification'] = [];
    }

    $_SESSION['flash_notification'][] = [
        'body' => $message,
        'type' => $type
    ];
}

/**
 * Get the flash messageges 
 * 
 * @return mixed An array with all the messages or null if none set
 */
public static function getMessage() {
    
    if (isset($_SESSION['flash_notification'])) {
        $messages = $_SESSION['flash_notification'];
        unset($_SESSION['flash_notification']);
        return $messages;
    }

}

}


?>