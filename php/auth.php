<?php
session_start();
$content = file_get_contents("../data/users.json");
$users = json_decode($content, true);

if (isset($_POST["register"])) {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $password = $_POST["password"];

    foreach ($users as $user) {
        if ($user["email"] == $email) {
            $_SESSION["flash_error"] = "email_exists";
            header("Location: /proiect_practica/index.php?form=register");
            exit();
        }
    }

    $newUser = ["name" => $name, "email" => $email, "password" => $password];
    $users[] = $newUser;
    $_SESSION["user_name"] = $name;
    $_SESSION["user_email"] = $email;
    file_put_contents("../data/users.json", json_encode($users, JSON_PRETTY_PRINT));
    header("Location: /proiect_practica/page.php");
    exit();
}

if (isset($_POST["login"])) {
    $email = $_POST["email"];
    $password = $_POST["password"];

    $emailFound = false;

    foreach ($users as $user) {
        if ($user["email"] == $email) {
            $emailFound = true;
            if ($user["password"] == $password) {
                $_SESSION["user_name"] = $user["name"];
                $_SESSION["user_email"] = $user["email"];
                header("Location: /proiect_practica/page.php");
                exit();
            } else {
                $_SESSION["flash_error"] = "login_error";
                $_SESSION["flash_email"] = $email;
                header("Location: /proiect_practica/index.php");
                exit();
            }
        }
    }

    if (!$emailFound) {
        $_SESSION["flash_error"] = "email_error";
        $_SESSION["flash_email"] = $email;
        header("Location: /proiect_practica/index.php");
        exit();
    }
}
?>