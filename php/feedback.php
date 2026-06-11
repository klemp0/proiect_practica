<?php
session_start();
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

$email = isset($data["email"]) ? trim($data["email"]) : '';
$message = isset($data["message"]) ? trim($data["message"]) : '';

if ($email === '' || $message === '') {
    echo json_encode(["error" => "fill_fields"]);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["error" => "invalid_email"]);
    exit();
}

$file = "../data/feedback.json";

$feedbacks = [];
if (file_exists($file)) {
    $content = file_get_contents($file);
    $decoded = json_decode($content, true);
    if (is_array($decoded)) {
        $feedbacks = $decoded;
    }
}

$feedbacks[] = [
    "email" => $email,
    "message" => $message,
    "date" => date("Y-m-d H:i:s")
];

file_put_contents($file, json_encode($feedbacks, JSON_PRETTY_PRINT));

echo json_encode(["success" => true]);
?>