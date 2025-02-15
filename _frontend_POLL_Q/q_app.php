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
$user = $post['user'];
if ($proc == null || $room == null) {
    echo json_encode([
        "statusCode" => 400,
        "data" => 'Parameters not found'
    ]);
    exit;
}

// Open database connection
// $host, $login, $password, $database are defined in q_app_config.php
require './q_app_config.php';
try {
    $connection = mysqli_connect($host, $login, $password, $database);
} catch (Exception $e) {
    $resp = $e->getMessage();
    echo json_encode([
        "statusCode" => 400,
        "data" => $resp
    ]);
    exit;
}

// Output data
$success = false;
$resp = 'ok';
$type = '';
$meta = '';
$status = 0;
$date = '';

// Check if the room exists, otherwise create it
$sql = "SELECT COUNT(*) AS n FROM solverpoll_question WHERE user = '$user' AND room = '$room'";
try {
    $query = mysqli_query($connection, $sql);
    $resp = $query->fetch_all(MYSQLI_ASSOC);
    if ($resp[0]['n'] == 0) {
        $sql = "INSERT INTO solverpoll_question (user, room) VALUES ('$user', '$room')";
        mysqli_query($connection, $sql);
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

// Get room data
$sql = "SELECT * FROM solverpoll_question WHERE room = '$room' LIMIT 1";
try {
    $query = mysqli_query($connection, $sql);
    $resp = $query->fetch_all(MYSQLI_ASSOC);
    if (count($resp) > 0) {
        $resp = $resp[0];
        $type = $resp['type'];
        $meta = $resp['meta'];
        $status = $resp['status'];
        $date = $resp['date'];
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





// Procedures
switch ($proc) {

    case 'q_update':
        $type = $post['type'];
        $meta = $post['meta'];
        $item = $post['item'];
        $sql = "UPDATE solverpoll_question SET meta = '$meta', `type` = '$type', `status`= 0, item = '$item' WHERE user = '$user' AND room = '$room'";
        try {
            mysqli_query($connection, $sql);
            $success = true;
            $resp = 'Room successfully updated';
        } catch (Exception $e) {
            $resp = $e->getMessage();
        }
        break;    
 

    case 'q_open':
        $sql = "UPDATE solverpoll_question SET status = 1 WHERE user = '$user' AND room = '$room'";
        try {
            mysqli_query($connection, $sql);
            $success = true;
            $resp = 'Room successfully opened';
        } catch (Exception $e) {
            $resp = $e->getMessage();
        }
        break;     
            
    case 'q_close':
        $sql = "UPDATE solverpoll_question SET status = 0 WHERE user = '$user' AND room = '$room'";
        try {
            mysqli_query($connection, $sql);
            $success = true;
            $resp = 'Room successfully closed';
        } catch (Exception $e) {
            $resp = $e->getMessage();
        }
        break;

    
    case 'q_responses':
        $item = $post['item'];
        $sql = "SELECT COUNT(*) AS responses FROM solverpoll_response WHERE room = '$room' AND item = '$item' AND (date >= NOW() - INTERVAL 1 DAY OR room LIKE 'mg-%')";
        try {
            $query = mysqli_query($connection, $sql);
            $resp = $query->fetch_all(MYSQLI_ASSOC);
            $resp = $resp[0];
            $resp['status'] = $status;
            $success = true;
        } catch (Exception $e) {
            $resp = $e->getMessage();
        }
        break;    
    
    case 'q_results':
        $item = $post['item'];
        if ($type == 'quiz') {
            $sql = "SELECT response, COUNT(*) AS responses FROM solverpoll_response WHERE room = '$room' AND item = '$item' AND (date >= NOW() - INTERVAL 1 DAY OR room LIKE 'mg-%') GROUP BY response ORDER BY response";
        } else if ($type == 'tag') {
            $sql = "SELECT response, COUNT(*) AS responses FROM solverpoll_response WHERE room = '$room' AND item = '$item' AND (date >= NOW() - INTERVAL 1 DAY OR room LIKE 'mg-%') GROUP BY response ORDER BY responses DESC LIMIT 50";
        } else if ($type == 'post') {
            $sql = "SELECT response FROM solverpoll_response WHERE room = '$room' AND item = '$item' AND LENGTH(TRIM(response)) > 3 AND (date >= NOW() - INTERVAL 1 DAY OR room LIKE 'mg-%') LIMIT 50";
        }
        try {
            $query = mysqli_query($connection, $sql);
            $resp = $query->fetch_all(MYSQLI_ASSOC);
            foreach ($resp as &$row) {
                foreach ($row as $key => $value) {
                    $row[$key] = mb_convert_encoding($value, "UTF-8", "ISO-8859-1");
                }
            }
            $success = true;
        } catch (Exception $e) {
            $resp = $e->getMessage();
        }
        break;    

    case 'q_clean':
        $item = $post['item'];
        $sql = "DELETE FROM solverpoll_response WHERE room = '$room' AND item = '$item'";
        try {
            mysqli_query($connection, $sql);
            $success = true;
            $resp = 'Responses successfully deleted';
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
