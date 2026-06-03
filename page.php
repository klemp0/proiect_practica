<?php
session_start();
if (!isset($_SESSION["user_name"])) {
    header("Location: /proiect_practica/index.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined">
  <link rel="stylesheet" href="css/pstyle.css">
</head>
<body>

<nav class="navbar">
  <div class="nav-logo">
    <img src="img/books.png" alt="" class="nav-logo-img">
    <span class="nav-logo-title">My Library</span>
  </div>

<div class="nav-links">
  <button type="button" class="nav-link active" id="btnAddBooks" onclick="showSection('addBooks')">Add Books</button>
  <button type="button" class="nav-link" id="btnMyBooks" onclick="showSection('myBooks')">My Books</button>
  <div class="nav-indicator" id="navIndicator"></div>
</div>

  <div class="nav-right">
    <button class="nav-btn">EN <span class="material-symbols-outlined">language</span></button>
    <button class="nav-btn"><span class="material-symbols-outlined">dark_mode</span></button>
<div class="nav-account" id="navAccount" onclick="toggleDropdown()">
  <span class="material-symbols-outlined">account_circle</span>
  <span class="nav-username"><?php echo $_SESSION["user_name"]; ?></span>
  <div class="nav-dropdown" id="navDropdown" style="display:none;">
    <a href="#" class="dropdown-item">
      <span class="material-symbols-outlined">edit</span> Edit
    </a>
    <a href="php/logout.php" class="dropdown-item">
      <span class="material-symbols-outlined">logout</span> Log Out
    </a>
  </div>
</div>
  </div>
</nav>

<div class="all">

  <div id="addBooks" class="section">
  <div class="book-modal">
    <div class="modal-content">
      <h2>Add a New Book</h2>
      <form id="addBookForm" class="form">
        <div class="form-group">
          <label for="title">Title</label>
          <input class="form-input" type="text" id="title" name="title" required>
        </div>
        <div class="form-group">
          <label for="author">Author</label>
          <input class="form-input" type="text" id="author" name="author" required>
        </div>
        <div class="btns-gap"> 
        <div class="category-btn" id="categoryBtn" onclick="toggleDropdown()">
  <span class="state">Don't read</span>
  <span class="material-symbols-outlined">arrow_drop_down</span>
  <div class="cat-dropdown" id="catDropdown" style="display:none;">
    <a href="#" class="dropdown-item">
      <span class="material-symbols-outlined">Read</span> Edit
    </a>
    <a href="#" class="dropdown-item">
      <span class="material-symbols-outlined">Want to read</span> Edit
    </a>
    <a href="#" class="dropdown-item">
      <span class="material-symbols-outlined">Finished</span> Edit
    </a>
    <a href="#" class="dropdown-item">
      <span class="material-symbols-outlined">On hold</span> Edit
    </a>
  </div>
</div>
    <div class="btn-div">
        <button type="submit" class="submit-btn">Add</button>
        </div>
        </div>
      </form>
    </div>
  </div>
  <div class="books-area">

    <div class="add-btn" id="addBtn" onclick="openModal()">
      <span class="material-symbols-outlined">add</span>
    </div>
    <div class="books-list" id="booksList">
    </div>

  </div>
</div>

</div>


<div id="myBooks" class="section" style="display:none;">
  <h2>My Books</h2>

</div>

<script src="js/pscript.js"></script>
</body>
</html>