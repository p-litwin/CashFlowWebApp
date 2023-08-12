<?php

namespace App;

use App\Config;
class Token {

/**
 * The token value
 * 
 * @var string 
 */
protected $token;



/**
 * Class constructor. Create new random token or assign an existing one if passed in.
 * 
 * @param string $token_value Optional token value
 */
public function __construct($token_value = null) {
    if ($token_value) {
       
        $this->token = $token_value;
    
    } else {
    
        $this->token = bin2hex(random_bytes(16)); // 16 bytes = 128 bits = 32 hex characters

    }
}

/**
 * Get value of the token
 * 
 * @return array|string
 */
public function getValue() {

    return $this->token;

}

/**
 * Generate the hash using the token and the secret key.
 * @return string
 */
public function getHash() {

    return hash_hmac('sha256', $this->token, Config::SECRET_KEY);

}

}

?>