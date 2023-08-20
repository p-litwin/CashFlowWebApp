<?php

namespace App;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

/**
 * Class to send emails
 */
class Mail {

    /**
     * Send a message
     * 
     * @param string $to Recipient
     * @param string $subject Mail subject
     * @param string $text Text only content of the message
     * @param string $html HTML content of the message
     * @return void
     */
    public static function send($to, $subject, $text, $html) {
        $mail = new PHPMailer(true);
        $mail->isSMTP();                                        //Send using SMTP
        $mail->Host       = Config::SMTP_HOST;                  //Set the SMTP server to send through
        $mail->SMTPAuth   = true;                               //Enable SMTP authentication
        $mail->Username   = Config::SMTP_USER;                  //SMTP username
        $mail->Password   = Config::SMTP_PASS;                  //SMTP password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;        //Enable implicit TLS encryption
        $mail->Port       = 465;                                //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
    
        $mail->setFrom('noreply@pawel-litwin.net');
        $mail->addAddress($to);                                 //Add a recipient
        $mail->CharSet = "UTF-8";                               //Change encoding to UTF-8
        //Content
        $mail->isHTML(true);                                  //Set email format to HTML
        $mail->Subject = $subject;
        $mail->Body    = $html;
        $mail->AltBody = $text;

        $mail->send();
    }

}


?>