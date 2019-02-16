<?php

require_once('config.php');
require_once('core.php');

/// @brief Class responsible for processing login requests
///
/// Checks specified 2 parameters (user and md5pass) and compares them
/// with values from the database. Then returns one of the folllowing
/// structures:
///
/// { 'success': true, 'login': ..., 'user_id': 123 }
/// { 'failure': true, msg: '...' }
class Login extends API {

    public function checkParameters() {
        $this->getString("username");
        $this->getString("password");
    }

    public function prepareResponse() {
        global $hevelius_debug;

        // Get the data from the client. Note that the md5pass is
        // now actually an MD5 password.
        $user = $this->getString("username");
        $md5pass = strtoupper($this->getString("password"));

        // Here's the actual query
        $q = "SELECT user_id, pass_d, login, firstname, lastname, share, phone, email, ".
            "permissions, aavso_id, ftp_login, ftp_pass FROM users WHERE login='".$user."'";

        $_result = $this->db_->query($q);
        if (!$_result) {
            // Uh oh, mysql is broken. Let's display the error, maybe it will
            // give the user some clue.
            $txt = "MySQL error";
            if ($hevelius_debug) {
                $txt .= ":" . $this->db_->error;
            }
            $this->error($txt);
        }

        if ($_result->num_rows == 0) {
            // Query returned 0 rows, so the user specified wrong login.
            
            $this->error("No user with such a login: " . $user);
        }

        // There's an entry in the DB. At least the login is good.
        // Get it and check if the pass matches.
        $row = $_result->fetch_assoc();

        $db_pass = strtoupper($row['pass_d']);
        if ($md5pass == $db_pass) {
            // Password is good, let's provide all the details.
            
            $this->answer_['user_id'] = intval($row['user_id']);
            $this->answer_['login'] = $row['login'];
            $this->answer_['firstname'] = $row['firstname'];
            $this->answer_['lastname'] = $row['lastname'];
            $this->answer_['share'] = intval($row['share']);
            $this->answer_['phone'] = $row['phone'];
            $this->answer_['email'] = $row['email'];
            $this->answer_['permissions'] = $row['permissions'];
            $this->answer_['aavso_id'] = $row['aavso_id'];
            $this->answer_['ftp_login'] = $row['ftp_login'];
            $this->answer_['ftp_pass'] = $row['ftp_pass'];
            if ($hevelius_debug) {
                $this->log("success, logging in user: login=" . $this->answer_['login']
                           . ", user_id=" . $this->answer_['user_id']);
            }

        } else {
            // Nope, incorrect password. Sod off!
            $this->error("Incorrect password");
        }

        $this->publish();
    }
}

 $l = new Login();

 $l->respond();

?>