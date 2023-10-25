<?php

namespace App\Controllers;

use Core\View;

class Settings extends Authenticated {
    public function showAction() {
        View::renderTemplate('Settings\show.html');
    }
}