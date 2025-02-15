<?php

// Headers settings to allow CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");


// Input data
$post = json_decode(file_get_contents("php://input"), true); 
$proc = $post['proc'];
$room = $post['room'];
if ($proc == null || $room == null) {
    echo json_encode([
        "statusCode" => 400,
        "data" => 'Parameters not found'
    ]);
    exit;
}

// Output data
$success = false;
$resp = 'ok';
$type = '';
$meta = '';
$item = 0;
$status = 0;
$room_user = '';

// Open database connection
// $host, $login, $password, $database are defined in q_app_config.php
require './r_app_config.php';
try {
    $connection = mysqli_connect($host, $login, $password, $database);
    mysqli_set_charset($connection, "utf8");
} catch (Exception $e) {
    $resp = $e->getMessage();
    echo json_encode([
        "statusCode" => 400,
        "data" => $resp
    ]);
    mysqli_close($connection); // Close database connection
    exit;
}

// Get room data
$sql = "SELECT * FROM solverpoll_question WHERE room = '$room' LIMIT 1";
try {
    $query = mysqli_query($connection, $sql);
    $resp = $query->fetch_all(MYSQLI_ASSOC);
    if (count($resp) > 0) {
        $resp = $resp[0];
        $type = $resp['type'];
        $meta = $resp['meta'];
        $item = $resp['item'];
        $status = $resp['status'];
        $room_user = $resp['user'];
    }
} catch (Exception $e) {
    $resp = $e->getMessage();
    echo json_encode([
        "statusCode" => 400,
        "data" => $resp
    ]);
    mysqli_close($connection); // Close database connection
    exit;
}

// Check if room exists
if ($type == '') {
    $resp = 'Room not found';
    echo json_encode([
        "statusCode" => 400,
        "data" => $resp
    ]);
    mysqli_close($connection); // Close database connection
    exit;
}

// Procedures
switch ($proc) {

   
    case 'r_status':
        $resp = [
            "status" => $status,
            "type" => $type,
            "meta" => $meta,
            "item" => $item,
        ];
        $success = true;
        break;    

    case 'r_response':
        if ($status != '1') {
            $resp = 'Room is not open';
            echo json_encode([
                "statusCode" => 400,
                "data" => $resp
            ]);
            mysqli_close($connection); // Close database connection
            exit;
        }
        $user = $post['user'];
        $response = $post['response'];
        $sql = "INSERT INTO solverpoll_response (user, room, item, response) VALUES ('$user', '$room', '$item', '$response')";
        try {
            mysqli_query($connection, $sql);
            $success = true;
            $resp = 'Response successfully registered';
        } catch (Exception $e) {
            $resp = $e->getMessage();
        }
        break;

}

// Finalizes the execution and returns the result
switch ($success) {
    case true:
        echo json_encode([
            "statusCode" => 200,
            "data" => $resp
        ]);
        mysqli_close($connection); // Close database connection
        break;
    case false:
        echo json_encode([
            "statusCode" => 400,
            "data" => $resp
        ]);
        mysqli_close($connection); // Close database connection
        break;
}



?>
