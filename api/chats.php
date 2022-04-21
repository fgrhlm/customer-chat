<?php
    
    // ini_set('display_errors', 1);
    // ini_set('display_startup_errors', 1);
    
    // DB
    include "connect.php";

    function authenticate($DB_CONN,$admin=false){
        $headers = apache_request_headers();
        $token = "";

        if($headers["Authentication"]){
            $token = $headers["Authentication"];
        }

        $q = $DB_CONN->prepare("SELECT * FROM sessions WHERE token=?");
        $q->bind_param("s",$token);
        $q->execute();
        $result = $q->get_result();
        $arr = $result->fetch_assoc();
        
        if($admin == false){
            if($arr){
                return true;
            }else{
                return false;
            }
        }else{
            if($arr["role"] == "admin"){
                return true;
            }else{
                return false;
            }
        }

    }

    // Hantera GET requests
    function get_all($DB_CONN) {
        $errObj = new \stdClass();
        $errObj->error = "denied";

        if(authenticate($DB_CONN,true)){
            $q = "SELECT * FROM chats";
            $result = $DB_CONN->query($q);
            $objarr = array();

            while($row = $result->fetch_assoc()) {
                $obj = new \stdClass();
                $obj->id = $row["id"];
                $obj->createdAt = $row["createdAt"];
                array_push($objarr,$obj);
            }

            header("Content-Type: application/json");
            echo json_encode($objarr);
            error_log($objarr);
        }else{
            header("Content-Type: application/json");
            echo json_encode([$errObj]);
            error_log($errObj);
        }
    }   

    // Hantera POST requests
    function create($DB_CONN){
        $obj = new \stdClass();
        try {
            $DB_CONN->query("INSERT INTO chats VALUES (NULL,NULL)");

            $obj->id = $DB_CONN->insert_id;
            $obj->token = generateToken($DB_CONN,$DB_CONN->insert_id);
        } catch (\Throwable $th) {
            error_log($th);
        }
        

        header("Content-Type: application/json");
        echo json_encode($obj);
    }

    // Genererar en token åt en client
    function generateToken($DB_CONN,$chatId){
        $token = "";
        try {
            $token = uniqid('',true);
            $role = "client";
    
            $q = $DB_CONN->prepare("INSERT INTO sessions (token,role,chatId) VALUES(?,?,?)");
            $q->bind_param("sss",$token,$role,$chatId);
            $res = $q->execute();
        } catch (\Throwable $th) {
            error_log($th);
        }
        
        return $token;
    }

    // Hantera Delete Requests
    function delete($DB_CONN){
        if(authenticate($DB_CONN,true)){
            $request_contents = file_get_contents("php://input");
            $req = json_decode($request_contents);
    
            $q = $DB_CONN->prepare("DELETE FROM chats WHERE id=?");
            $q->bind_param("i",$req->id);
            $q->execute();
        }
    }

    // Request metoden
    $request_method = $_SERVER["REQUEST_METHOD"];
    // Lite inspirerad från denna post https://stackoverflow.com/questions/359047/detecting-request-type-in-php-get-post-put-or-delete
    switch($request_method) {
        case 'GET':
            get_all($DB_CONN);
            break;
        case 'POST':
            create($DB_CONN);            
            break;
        case 'DELETE':
            delete($DB_CONN);
            break;
        default:
            break;
    }
?>