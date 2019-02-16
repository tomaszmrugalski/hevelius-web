<?php

define("RESULT_SUCCESS", 0);
define("RESULT_ERROR", 1);
define("RESULT_EMPTY", 2);

class API {

    protected $db_;

    public $log_file_;

    public function __construct() {

        global $hevelius_db_host;
        global $hevelius_db_user;
        global $hevelius_db_pass;
        global $hevelius_db_name;
        global $hevelius_debug;

        header('Content-Type: application/json; charset=utf-8');

        if ($hevelius_debug) {
            header("Access-Control-Allow-Origin: *");
            header('Access-Control-Allow-Headers: origin, content-type');
        }

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
            $this->error("Specified parameter '".$name."' has type ".gettype($this->params_->$name)." but string was expected");
        }

        return $this->params_->$name;
    }

    public function getInteger($name) {
        if (! isset($this->params_) || $this->params_ == NULL) {
            $this->error("No parameters specified, at least '". $name . "' required.");
        }        
        if (gettype($this->params_) != "object") {
            $this->error("Invalid parameter syntax (type is ".gettype($this->params_)."), expected JSON map.");
        }
        if (!array_key_exists($name, $this->params_)) {
            $this->error("Mandatory string parameter '". $name. "' not specified.");
        }

        if (gettype($this->params_->$name) != "integer") {
            $this->error("Specified parameter '".$name."' has type ".gettype($this->params_->$name)." but integer was expected");
        }

        return intval($this->params_->$name);
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

?>
