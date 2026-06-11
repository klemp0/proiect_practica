<?php
session_start();
if (!isset($_SESSION["user_name"])) {
    header("Location: /MyLibrary/index.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script>
    (function() {
      var theme = localStorage.getItem('theme');
      if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    })();
  </script>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,0">
  <link rel="stylesheet" href="css/pstyle.css">
  <link rel="stylesheet" href="css/p2style.css">
</head>
<body>

<nav class="navbar">
  <div class="nav-logo">
    <img src="img/books.png" alt="" class="nav-logo-img">
    <span class="nav-logo-title">My Library</span>
  </div>

  <div class="nav-links">
    <button type="button" class="nav-link active" id="btnAddBooks" onclick="showSection('addBooks')" data-i18n="nav_add">Add Books</button>
    <button type="button" class="nav-link" id="btnMyBooks" onclick="showSection('myBooks')" data-i18n="nav_my">My Books</button>
    <div class="nav-indicator" id="navIndicator"></div>
  </div>

  <div class="nav-right">
    <div class="lang-btn-wrap" id="langBtnWrap" onclick="toggleLangDropdown()">
      <span id="langLabel">EN</span>
      <span class="material-symbols-outlined">language</span>
      <div class="lang-dropdown" id="langDropdown" style="display:none;">
        <a href="#" class="lang-option" onclick="setLang(event, 'en')">EN</a>
        <a href="#" class="lang-option" onclick="setLang(event, 'ro')">RO</a>
        <a href="#" class="lang-option" onclick="setLang(event, 'ru')">RU</a>
      </div>
    </div>
    <button class="nav-btn" onclick="toggleTheme()"><span class="material-symbols-outlined" data-theme-icon>dark_mode</span></button>
    <div class="nav-account" id="navAccount" onclick="toggleDropdown()">
      <span class="material-symbols-outlined">account_circle</span>
      <span class="nav-username"><?php echo $_SESSION["user_name"]; ?></span>
      <div class="nav-dropdown" id="navDropdown" style="display:none;">
        <a href="#" class="dropdown-item" onclick="openEditModal(); return false;">
          <span class="material-symbols-outlined">edit</span> <span data-i18n="edit">Edit</span>
        </a>
        <a href="php/logout.php" class="dropdown-item">
          <span class="material-symbols-outlined">logout</span> <span data-i18n="logout">Log Out</span>
        </a>
      </div>
    </div>
  </div>
</nav>

<div id="addBooks" class="section-wrap">
  <div class="main-row">
    <div class="add-modal" id="addModal" style="display:none;">
      <div class="modal-inner">
        <div class="modal-header">
          <span class="material-symbols-outlined" style="font-size:20px; color:#8B6344;">menu_book</span>
          <span class="modal-title" data-i18n="add_book_title">Add a Book</span>
        </div>
        <form id="addBookForm" class="modal-form">
          <div class="form-group">
            <label data-i18n="title_label">Title</label>
            <input class="form-input" type="text" id="title" placeholder="Book title" data-i18n-placeholder="title_placeholder">
          </div>
          <div class="form-group">
            <label data-i18n="author_label">Author</label>
            <input class="form-input" type="text" id="author" placeholder="Author name" data-i18n-placeholder="author_placeholder">
          </div>
          <div class="modal-footer">
            <div style="position:relative;">
              <button type="button" class="category-btn" id="categoryBtn" onclick="toggleCatDropdown(event)">
                <span id="categoryState" data-cat-value="Don't read">Don't read</span>
                <span class="material-symbols-outlined" style="font-size:16px;">arrow_drop_down</span>
              </button>
              <div class="cat-dropdown" id="catDropdown" style="display:none;">
                <a href="#" class="dropdown-item" data-i18n="cat_dont_read" onclick="selectCategory(event, 'Don\'t read')">Don't read</a>
                <a href="#" class="dropdown-item" data-i18n="cat_reading" onclick="selectCategory(event, 'Reading')">Reading</a>
                <a href="#" class="dropdown-item" data-i18n="cat_want" onclick="selectCategory(event, 'Want to read')">Want to read</a>
                <a href="#" class="dropdown-item" data-i18n="cat_finished" onclick="selectCategory(event, 'Finished')">Finished</a>
                <a href="#" class="dropdown-item" data-i18n="cat_hold" onclick="selectCategory(event, 'On hold')">On hold</a>
              </div>
            </div>
            <button type="submit" class="submit-btn">
              <span class="material-symbols-outlined" style="font-size:16px;">add</span> <span data-i18n="add_btn">Add</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="add-btn" id="addBtn" onclick="toggleModal()">
      <span class="material-symbols-outlined">add</span>
    </div>

    <div class="books-area">
      <div class="books-list" id="booksList"></div>
    </div>
  </div>
</div>

<div id="myBooks" style="display:none;">
  <div class="mybooks-wrap">
    <div class="mybooks-tabs">
      <button class="mybooks-tab active" data-filter="all" onclick="filterBooks('all', this)"><span class="tab-text" data-i18n="tab_all">All books</span></button>
      <button class="mybooks-tab" data-filter="saved" onclick="filterBooks('saved', this)"><span class="tab-text" data-i18n="tab_saved">Saved</span></button>
      <button class="mybooks-tab" data-filter="Reading" onclick="filterBooks('Reading', this)"><span class="tab-text" data-i18n="tab_reading">Reading</span></button>
      <button class="mybooks-tab" data-filter="Want to read" onclick="filterBooks('Want to read', this)"><span class="tab-text" data-i18n="tab_want">Want to read</span></button>
      <button class="mybooks-tab" data-filter="Finished" onclick="filterBooks('Finished', this)"><span class="tab-text" data-i18n="tab_finished">Finished</span></button>
      <button class="mybooks-tab" data-filter="On hold" onclick="filterBooks('On hold', this)"><span class="tab-text" data-i18n="tab_hold">On hold</span></button>
    </div>
    <div class="mybooks-indicator-wrap">
      <div class="mybooks-indicator" id="mybooksIndicator"></div>
    </div>
    <div class="books-list" id="myBooksList"></div>
  </div>
</div>

<footer>
  <div class="footer-wrap">
    <div class="footer-main">
      <div class="footer-left">
        <div class="footer-logo">
          <img src="img/books.png" alt="" class="footer-logo-img">
          <span class="footer-logo-title">My Library</span>
        </div>
        <div class="footer-desc">
          <span data-i18n="footer_desc">A personal app for organizing your book collection. Simple, fast, and always at hand.</span>
          <br><span class="footer-privacy" data-i18n="privacy">Privacy Policy</span>
        </div>
        <div class="contact">
          <div class="socials" data-i18n="socials">Socials</div>
          <div class="social-img">
            <a href="https://github.com/klemp0/proiect_practica" target="_blank">
              <img src="img/github.png" alt="" class="footer-img">
            </a>
            <a href=""><img src="img/instagram.png" alt="" class="footer-img"></a>
            <a href=""><img src="img/telegram.png" alt="" class="footer-img"></a>
          </div>
        </div>
      </div>
      <div class="footer-right">
        <div class="feedback-title" data-i18n="feedback">Feedback</div>
<div class="footer-field">
  <label class="footer-label" data-i18n="feedback_email">e-mail</label>
  <input class="footer-input" type="email" id="feedbackEmail" placeholder="email@example.com">
</div>
<div class="footer-field">
  <label class="footer-label" data-i18n="feedback_message">message</label>
  <textarea class="footer-textarea" id="feedbackMessage" placeholder="Write your message here..."></textarea>
</div>
<button class="send-btn" onclick="submitFeedback()">
  <span class="material-symbols-outlined">send</span> <span data-i18n="send">Send</span>
</button>
      </div>
    </div>
    <div class="footer-bottom">
      <hr class="footer-divider">
      <div class="footer-copy" data-i18n="footer_copy">© 2026 My Library — All rights reserved</div>
    </div>
  </div>
</footer>

<div class="edit-overlay" id="editOverlay" onclick="closeEditModal()"></div>
<div class="edit-modal" id="editModal">
  <div class="modal-header">
    <span class="material-symbols-outlined" style="font-size:20px; color:#8B6344;">edit</span>
    <span class="modal-title" data-i18n="edit_title">Edit Profile</span>
  </div>
  <div class="form-group">
    <label data-i18n="edit_name">New Name</label>
    <input class="form-input" type="text" id="editName" placeholder="<?php echo $_SESSION['user_name']; ?>">
  </div>
  <div class="form-group">
    <label data-i18n="edit_password">Password</label>
    <input class="form-input" type="password" id="editPassword" placeholder="••••••••">
  </div>
  <div id="editError" class="error-msg" style="display:none;"></div>
  <button class="submit-btn" style="margin-top:8px; width:100%; justify-content:center;" onclick="submitEdit()" data-i18n="edit_save">Save</button>
</div>

<div id="feedbackToast" class="toast"></div>

<script src="js/pscript.js"></script>
</body>
</html>