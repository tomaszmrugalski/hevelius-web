<?php

require_once('config.php');
require_once('core.php');


class Tasks extends API {

    public function checkParameters() {
        $this->getInteger("user_id");
        $this->getString("password");
        $this->getInteger("limit");
    }

    public function prepareResponse() {
        global $hevelius_debug;

        // Get the data from the client. Note that the md5pass is
        // now actually an MD5 password.
        $user_id = $this->getInteger("user_id");
        $md5pass = strtoupper($this->getString("password"));
        $limit   = $this->getInteger("limit");

        // @TODO: Check credentials.

        $q = "SELECT task_id, user_id, scope_id, object, ra, decl, ".
             "exposure, descr, filter, binning, guiding, dither, ".
             "defocus, calibrate, solve, vphot, other_cmd, ".
             "min_alt, moon_distance, skip_before, skip_after, ".
             "min_interval, comment, state, imagename, ".
             "created, activated, performed, max_moon_phase, ".
             "max_sun_alt, auto_center, calibrated, solved, ".
            "sent FROM tasks ORDER by task_id DESC LIMIT ".$limit;
        $result = $this->db_->query($q);
        if (!$result) {
            // Uh oh, mysql is broken. Let's display the error, maybe it will
            // give the user some clue.
            $txt = "MySQL error";
            if ($hevelius_debug) {
                $txt .= ":" . $this->db_->error;
            }
            $this->error($txt);
        }

        if ($result->num_rows == 0) {
            // Query returned 0 rows, so the user specified wrong login.
            
            $this->error("No tasks found.");
        }

        $this->answer_['tasks'] = array();
        
        while ($row = $result->fetch_assoc()) {
            array_push($this->answer_['tasks'], $row);
        }
        
        $this->publish();
    }

}


$t = new Tasks();
$t->respond();

?>
