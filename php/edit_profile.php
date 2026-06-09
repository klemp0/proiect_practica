<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION["user_email"])) {
    echo json_encode(["error" => "not logged in"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$newName = trim($data["name"]);
$password = $data["password"];

$content = file_get_contents("../data/users.json");
$users = json_decode($content, true);

$found = false;
foreach ($users as &$user) {
    if ($user["email"] === $_SESSION["user_email"]) {
        if (!password_verify($password, $user["password_hash"])) {
            echo json_encode(["error" => "Incorrect password."]);
            exit();
        }
        $user["name"] = $newName;
        $_SESSION["user_name"] = $newName;
        $found = true;
        break;
    }
}

if (!$found) {
    echo json_encode(["error" => "User not found."]);
    exit();
}

file_put_contents("../data/users.json", json_encode($users, JSON_PRETTY_PRINT));
echo json_encode(["success" => true]);
?>