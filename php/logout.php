<?php
session_start();
session_destroy();
header("Location: /proiect_practica/index.php");
exit();
?>