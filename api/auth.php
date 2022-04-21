<?php

    // debug print
    // ini_set('display_errors', 1);
    // ini_set('display_startup_errors', 1);
    // error_reporting(E_ALL);

    // DB
    include "connect.php";

    // Hantera POST requests
    function login($DB_CONN){
        $request_contents = file_get_contents("php://input");
        $req = json_decode($request_contents);
        
        $q = $DB_CONN->prepare("SELECT * from users WHERE username=?");
        $q->bind_param("s",$req->username);
        $res = $q->execute();
        $result = $q->get_result();
        $arr = $result->fetch_assoc();
        
        $resObj = new \stdClass();

        if($arr){
            if(password_verify($req->password,$arr["password"])){
                $resObj->success = "true";
                $resObj->token = generateToken($DB_CONN);
            }else{
                $resObj->success = "false";
            }
        }else{
            $resObj->success = "false";
        }

        header("Content-Type: application/json");
        echo json_encode($resObj);
    }

    function generateToken($DB_CONN){
        $token = uniqid('',true);
        $role = "admin";

        $q = $DB_CONN->prepare("INSERT INTO sessions (token,role) VALUES(?,?)");
        $q->bind_param("ss",$token,$role);
        $res = $q->execute();
        
        return $token;
    }

    // Request metoden
    $request_method = $_SERVER["REQUEST_METHOD"];

    // Lite inspirerad från denna post https://stackoverflow.com/questions/359047/detecting-request-type-in-php-get-post-put-or-delete
    switch($request_method) {
        case 'POST':
            login($DB_CONN);
            break;
        default:
            break;
    }

?>