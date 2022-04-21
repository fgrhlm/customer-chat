<?php
    
    // ini_set('display_errors', 1);
    // ini_set('display_startup_errors', 1);
    // error_reporting(E_ALL);
    

    // DB
    include "connect.php";

    function authenticate($DB_CONN){
        $headers = apache_request_headers();
        $token = "";

        if($headers != false){
            $token = $headers["Authentication"];
        }

        $q = $DB_CONN->prepare("SELECT * FROM sessions WHERE token=?");
        $q->bind_param("s",$token);
        $q->execute();
        $result = $q->get_result();
        $arr = $result->fetch_assoc();
        
        if($arr){
            return true;
        }else{
            return false;
        }
    }

    // Hantera GET requests
    function get($DB_CONN,$id) {
            
            $q = $DB_CONN->prepare("SELECT * FROM messages WHERE chatId=?");
            $q->bind_param("i",intval($id));
            $q->execute();
            $result = $q->get_result();
            $objarr = array();

            while($row = $result->fetch_assoc()) {
                $obj = new \stdClass();

                $obj->chatId = $row["chatId"];
                $obj->sent_from = $row["sent_from"];
                $obj->sent_to = $row["sent_to"];
                $obj->message = $row["message"];
                $obj->createdAt = $row["createdAt"];
                array_push($objarr,$obj);
            }

            $q->close();

            header("Content-Type: application/json");
            echo json_encode($objarr);
    }   

    // Hantera POST requests
    function create($DB_CONN){
        $request_contents = file_get_contents("php://input");
        $req = json_decode($request_contents);
        $chatId = "";
        
        if($req->chatId){
            $chatId = $req->chatId;
        }
        
        $q = $DB_CONN->prepare("INSERT INTO messages (chatId,sent_from,sent_to,message) VALUES (?,?,?,?)");
        $q->bind_param("isss",$req->chatId,$req->sent_from,$req->sent_to,$req->message);
        $res = $q->execute();
        if($res){            
            $DB_CONN->close();
        }else{
            $q->close();
        }
    }

    // Request metoden
    $request_method = $_SERVER["REQUEST_METHOD"];
    // Lite inspirerad från denna post https://stackoverflow.com/questions/359047/detecting-request-type-in-php-get-post-put-or-delete
    switch($request_method) {
        case 'GET':
            get($DB_CONN,htmlspecialchars($_GET["id"]));
            break;
        case 'POST':
            create($DB_CONN);
            break;
        default:
            break;
    }
?>