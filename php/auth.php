<?php
$name = $_POST["name"];
$email = $_POST["email"];
$password = $_POST["password"];
$repeat_password = $_POST["repeat_password"];

$content = file_get_contents("../data/users.json");
$users = json_decode($content, true);

foreach($users as $user){
    if($user["email"] == $email){
         header("Location: /proiect_practica/index.php?form=register&error=email_exists");
        exit();
    }
}

$newUser = [
    "name" => $name,
    "email" => $email,
    "password" => $password,
    "repeat_password" => $repeat_password
];

$users[] = $newUser;

if (!filter_var($email, FILTER_VALIDATE_EMAIL)){
    header("Location: /proiect_practica/index.php?form=register&error=invalid_email");
    exit();
}
if(strlen($password) < 8){
    header("Location: /proiect_practica/index.php?form=register&error=password_short");
    exit();
}
if(!preg_match('/[a-z]/', $password) || !preg_match('/[A-Z]/', $password) || !preg_match('/[0-9]/', $password)){
    header("Location: /proiect_practica/index.php?form=register&error=password_weak");
    exit();
}
if($password != $repeat_password){
    header("Location: /proiect_practica/index.php?form=register&error=password_mismatch");
    exit();
}

file_put_contents("../data/users.json", json_encode($users, JSON_PRETTY_PRINT));

header("Location: /proiect_practica/page.php");
exit();
?>