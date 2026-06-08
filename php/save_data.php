<?php
session_start();

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
        $newBook = [
            "title"    => $data["title"],
            "author"   => $data["author"],
            "cover"    => $data["cover"],
            "genres"   => $data["genres"],
            "rating"   => $data["rating"],
            "category" => $data["category"],
            "saved"    => false
        ];
        $books[] = $newBook;
        file_put_contents($userFile, json_encode($books, JSON_PRETTY_PRINT));
        echo json_encode(["success" => true]);
        exit();
    }

    if ($data["action"] === "update_category") {
        $index = $data["index"];
        if (isset($books[$index])) {
            $books[$index]["category"] = $data["category"];
        }
        file_put_contents($userFile, json_encode($books, JSON_PRETTY_PRINT));
        echo json_encode(["success" => true]);
        exit();
    }

    if ($data["action"] === "toggle_saved") {
        $index = $data["index"];
        if (isset($books[$index])) {
            $books[$index]["saved"] = !$books[$index]["saved"];
        }
        file_put_contents($userFile, json_encode($books, JSON_PRETTY_PRINT));
        echo json_encode(["success" => true]);
        exit();
    }

    if ($data["action"] === "delete") {
        $index = $data["index"];
        if (isset($books[$index])) {
            array_splice($books, $index, 1);
        }
        file_put_contents($userFile, json_encode($books, JSON_PRETTY_PRINT));
        echo json_encode(["success" => true]);
        exit();
    }
}
?>