<?php
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    // DB
    include "connect.php";

    $admin_username = "admin";
    $admin_password = "strongpassword";
    $admin_password_hashed = password_hash($admin_password,PASSWORD_DEFAULT);

    $q = $DB_CONN->prepare("INSERT INTO users (username,password) VALUES (?,?)");
    $q->bind_param("ss",$admin_username,$admin_password_hashed);
    $q->execute();

    $q->close();
?>