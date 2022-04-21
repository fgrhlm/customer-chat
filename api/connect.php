<?php 
    # MariaDB creds
    $DB_SERVER = "10.0.2.2";
    $DB_USER = "root";
    $DB_PASS = "strongpassword";
    $DB_NAME = "chat";

    # Anslut
    $DB_CONN = new mysqli($DB_SERVER,$DB_USER,$DB_PASS,$DB_NAME);
?>
