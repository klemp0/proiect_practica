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

  <div class="book-modal" id="bookModal" style="display:none;">
    <div class="modal-content">
      <h2>Add a New Book</h2>
      <form id="addBookForm" class="form">
        <div class="form-group">
          <label for="title">Title</label>
          <input class="form-input" type="text" id="title" name="title" placeholder="Book title">
        </div>
        <div class="form-group">
          <label for="author">Author</label>
          <input class="form-input" type="text" id="author" name="author" placeholder="Author name">
        </div>
        <div class="btns-gap">
          <div style="position:relative;">
            <button type="button" class="category-btn" id="categoryBtn" onclick="toggleCatDropdown(event)">
              <span class="state" id="categoryState">Don't read</span>
              <span class="material-symbols-outlined" style="font-size:18px;">arrow_drop_down</span>
            </button>
            <div class="cat-dropdown" id="catDropdown" style="display:none; position:absolute; top:110%; left:0; background:#FAF6F1; border:1px solid #DFC8A8; border-radius:8px; padding:6px; min-width:130px; box-shadow:0 4px 12px rgba(91,61,34,0.1); z-index:200;">
              <a href="#" class="dropdown-item" onclick="selectCategory(event, 'Don\'t read')">Don't read</a>
              <a href="#" class="dropdown-item" onclick="selectCategory(event, 'Reading')">Reading</a>
              <a href="#" class="dropdown-item" onclick="selectCategory(event, 'Want to read')">Want to read</a>
              <a href="#" class="dropdown-item" onclick="selectCategory(event, 'Finished')">Finished</a>
              <a href="#" class="dropdown-item" onclick="selectCategory(event, 'On hold')">On hold</a>
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
    <div class="add-btn" id="addBtn" onclick="toggleModal()">
      <span class="material-symbols-outlined">add</span>
    </div>
    <div class="books-list" id="booksList"></div>
  </div>

</div>


<div id="myBooks" class="section" style="display:none;">
  <h2>My Books</h2>

</div>
<script src="js/pscript.js"></script>
  </body>
</html>
</body>
</html>