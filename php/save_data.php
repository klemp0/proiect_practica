<?php
session_start();

header('Cache-Control: no-store, no-cache, must-revalidate');
header('Content-Type: application/json');

if (!isset($_SESSION["user_email"])) {
    echo json_encode(["error" => "not logged in"]);
    exit();
}

$userFile = "../data/books_" . preg_replace('/[^a-zA-Z0-9]/', '_', $_SESSION["user_email"]) . ".json";

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    if (file_exists($userFile)) {
        $books = json_decode(file_get_contents($userFile), true);
        echo json_encode($books);
    } else {
        echo json_encode([]);
    }
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    $books = [];
    if (file_exists($userFile)) {
        $books = json_decode(file_get_contents($userFile), true);
    }

    if (!isset($data["action"])) {
        $books[] = [
            "title"    => $data["title"],
            "author"   => $data["author"],
            "cover"    => $data["cover"],
            "genres"   => $data["genres"],
            "category" => $data["category"],
            "saved"    => false
        ];
        file_put_contents($userFile, json_encode($books, JSON_PRETTY_PRINT));
        echo json_encode(["success" => true]);
        exit();
    }

    if ($data["action"] === "update_category") {
        if (isset($books[$data["index"]])) {
            $books[$data["index"]]["category"] = $data["category"];
        }
        file_put_contents($userFile, json_encode($books, JSON_PRETTY_PRINT));
        echo json_encode(["success" => true]);
        exit();
    }

    if ($data["action"] === "toggle_saved") {
        if (isset($books[$data["index"]])) {
            $books[$data["index"]]["saved"] = !$books[$data["index"]]["saved"];
        }
        file_put_contents($userFile, json_encode($books, JSON_PRETTY_PRINT));
        echo json_encode(["success" => true]);
        exit();
    }

    if ($data["action"] === "delete") {
        if (isset($books[$data["index"]])) {
            array_splice($books, $data["index"], 1);
        }
        file_put_contents($userFile, json_encode($books, JSON_PRETTY_PRINT));
        echo json_encode(["success" => true]);
        exit();
    }
}
?>