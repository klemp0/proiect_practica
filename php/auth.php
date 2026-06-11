<?php
session_start();
$content = file_get_contents("../data/users.json");
$users = json_decode($content, true);

if (isset($_POST["register"])) {
    $id = count($users) + 1;
    $name = $_POST["name"];
    $email = $_POST["email"];
    $password = $_POST["password"];

    foreach ($users as $user) {
        if ($user["email"] == $email) {
            $_SESSION["flash_error"] = "email_exists";
            header("Location: /MyLibrary/index.php?form=register");
            exit();
        }
    }

    $newUser = [
    "id" => $id,
    "name" => $name,
    "email" => $email,
    "password_hash" => password_hash($password, PASSWORD_BCRYPT)
    ];

    $users[] = $newUser;
    $_SESSION["user_name"] = $name;
    $_SESSION["user_email"] = $email;
    file_put_contents("../data/users.json", json_encode($users, JSON_PRETTY_PRINT));
    header("Location: /MyLibrary/page.php");
    exit();
}

if (isset($_POST["login"])) {
    $email = $_POST["email"];
    $password = $_POST["password"];

    $emailFound = false;

foreach ($users as $user) {
    if ($user["email"] == $email) {
        $emailFound = true;

        if (password_verify($password, $user["password_hash"])) {
            $_SESSION["user_name"] = $user["name"];
            $_SESSION["user_email"] = $user["email"];
            header("Location: /MyLibrary/page.php");
            exit();
        } else {
            $_SESSION["flash_error"] = "login_error";
            $_SESSION["flash_email"] = $email;
            header("Location: /MyLibrary/index.php");
            exit();
        }
    }
}

    if (!$emailFound) {
        $_SESSION["flash_error"] = "email_error";
        $_SESSION["flash_email"] = $email;
        header("Location: /MyLibrary/index.php");
        exit();
    }
}
?>