<?php
session_start();
session_destroy();
header("Location: /MyLibrary/index.php");
exit();
?>