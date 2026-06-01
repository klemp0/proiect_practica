<?php
session_start();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Library</title>
</head>
<body>
  <h1>Bun venit, <?php echo $_SESSION['user_name']; ?>!</h1>
  <p>Înregistrarea a funcționat!</p>
</body>
</html>