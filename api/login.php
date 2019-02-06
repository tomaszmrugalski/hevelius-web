<?php

require_once('config.php');

define("RESULT_SUCCESS", 0);
define("RESULT_ERROR", 1);
define("RESULT_EMPTY", 2);

class API {

    protected $db_;
    protected $result_;

    public $error_;
    public $log_file_;

    public function __construct() {

        header('Content-Type: application/json; charset=utf-8');

        global $hevelius_db_host;
        global $hevelius_db_user;
        global $hevelius_db_pass;
        global $hevelius_db_name;
        global $hevelius_debug;

        $this->answer_ = array();

        $this->db_ = new mysqli($hevelius_db_host, $hevelius_db_user,
                                $hevelius_db_pass, $hevelius_db_name);
        if (!$this->db_->set_charset("latin1")) {
            $this->error('set_charset(utf8) failed.');
        }
        mysqli_set_charset($this->db_, "utf8mb4");

        if ($this->db_->connect_error) {
            $this->error('Connection error: '.$this->db_->connect_error);
        }
    }

    public function error($txt) {
        $this->answer_['result'] = RESULT_ERROR;
        $this->answer_['msg'] = $txt;
        $this->publish();

        if (isset($this->db_)) {
            $this->db_->close();
        }

        die();
    }

    public function respond() {

        $json = file_get_contents('php://input');
        $this->params_ = json_decode($json);

        $this->checkParameters();
        $this->prepareResponse();
        $this->publish();
    }

    public function log($txt) {
        $filename = "/var/www/html/logs/hevelius-api.txt";
        $prefix = date('[Y-m-d H:i:s]');
        file_put_contents($filename, $prefix . " " . $txt."\n", FILE_APPEND);
    }

    public function getString($name) {
        if (! isset($this->params_) || $this->params_ == NULL) {
            $this->error("No parameters specified, at least '". $name . "' required.");
        }        
        if (gettype($this->params_) != "object") {
            $this->error("Invalid parameter syntax (type is ".gettype($this->params_)."), expected JSON map.");
        }
        if (!array_key_exists($name, $this->params_)) {
            $this->error("Mandatory string parameter '". $name. "' not specified.");
        }

        if (gettype($this->params_->$name) != "string") {
            $this->error("Specified parameter '".$name."' has type ".gettype($this->params_[$name])." but string was expected");
        }

        return $this->params_->$name;
    }

    public function publish() {
        if (!isset($this->answer_['result'])) {
            $this->answer_['result'] = RESULT_SUCCESS;
        }

        print (json_encode($this->answer_, JSON_PRETTY_PRINT));

        if (isset($this->db_)) {
            $this->db_->close();
            die();
        }
    }
};

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
        global $hevelius_db_debug;

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
            if ($hevelius_db_debug) {
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
            
            $this->answer_['user_id'] = $row['user_id'];
            $this->answer_['login'] = $row['login'];
            $this->answer_['firstname'] = $row['firstname'];
            $this->answer_['lastname'] = $row['lastname'];
            $this->answer_['share'] = $row['share'];
            $this->answer_['phone'] = $row['phone'];
            $this->answer_['email'] = $row['email'];
            $this->answer_['permissions'] = $row['permissions'];
            $this->answer_['aavso_id'] = $row['aavso_id'];
            $this->answer_['ftp_login'] = $row['ftp_login'];
            $this->answer_['ftp_pass'] = $row['ftp_pass'];
            if ($hevelius_db_debug) {
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