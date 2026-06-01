<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

<div class="top-bar">
  <button class="lang-btn">EN <span class="material-symbols-outlined">language</span></button>
  <button class="theme-btn"><span class="material-symbols-outlined">dark_mode</span></button>
</div>

<div class="page-wrap">
  <div class="hero">
    <div class="logo">
      <img src="img/books.png" alt="" class="logo-img">
       <span class="logo-title">My Library</span>
    </div>
<div class="auth-card" id="loginForm">
  <div class="card-title">Enter Your Account</div>
<div class="tab-switcher">
    <button type="button" class="tab-btn active" id="loginTab">Log In</button>
    <button type="button" class="tab-btn" id="registerTab" onclick="showRegister()">Register</button>
</div>
  <form action="php/auth.php" method="POST">
    <input type="hidden" name="login" value="1">
    <div class="form-group">
      <label class="form-label">E-mail</label>
      <input class="form-input" type="email" name="email" placeholder="email@example.com">
    </div>
    <div class="form-group">
      <label class="form-label">Password</label>
      <input class="form-input" type="password" name="password" placeholder="••••••••">
    </div>
    <button class="submit-btn" type="submit">➔ Log In</button>
  </form>
</div>

<div class="auth-card" id="registerForm" style="display: none;">
  <div class="card-title">Create Your Account</div>
<div class="tab-switcher">
    <button type="button" class="tab-btn" id="loginTab2" onclick="showLogin()">Log In</button>
    <button type="button" class="tab-btn active" id="registerTab2">Register</button>
</div>
  <form action="php/auth.php" method="POST">
    <input type="hidden" name="register" value="1">
    <div class="form-group">
      <label class="form-label">Name</label>
      <input class="form-input" type="text" name="name" placeholder="Your name">
    </div>
        <?php if (isset($_GET['error']) && $_GET['error'] == 'email_exists'): ?>
    <div class="error-msg">This email is already registered.</div>
<?php endif; ?>
        <?php if (isset($_GET['error']) && $_GET['error'] == 'invalid_email'): ?>
    <div class="error-msg">Invalid email.</div>
<?php endif; ?>
    <div class="form-group">
      <label class="form-label">E-mail</label>
      <input class="form-input" type="email" name="email" placeholder="email@example.com">
    </div>
            <?php if (isset($_GET['error']) && $_GET['error'] == 'password_short'): ?>
    <div class="error-msg">Password is too short. At least 8 char.</div>
<?php endif; ?>
        <?php if (isset($_GET['error']) && $_GET['error'] == 'password_weak'): ?>
    <div class="error-msg">Password must include a lowercase letter, an uppercase letter, and a number.</div>
<?php endif; ?>
    <div class="form-group">
      <label class="form-label">Password</label>
      <input class="form-input" type="password" name="password" placeholder="••••••••">
    </div>
        <?php if (isset($_GET['error']) && $_GET['error'] == 'password_mismatch'): ?>
    <div class="error-msg">Passwords do not match.</div>
<?php endif; ?>
    <div class="form-group">
      <label class="form-label">Repeat Password</label>
      <input class="form-input" type="password" name="repeat_password" placeholder="••••••••">
    </div>
    <button class="submit-btn" type="submit">➔ Register</button>
  </form>
</div>
    </div>
    <div class="books-bg">
        <img src="img/landing_bg.jpg" alt="">
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
          O aplicație personală pentru organizarea colecției tale de cărți. Simplu, rapid și mereu la îndemână.
        </div>
        <a href="https://github.com/klemp0/proiect_practica" target="_blank">
          <img src="img/github.png" alt="" class="footer-github-img">
        </a>
        <span class="footer-privacy">Privacy Policy</span>
      </div>

      <div class="footer-right">
        <div class="feedback-title">Feedback</div>
        <div class="footer-field">
          <label class="footer-label">e-mail</label>
          <input class="footer-input" type="email" placeholder="email@example.com">
        </div>
        <div class="footer-field">
          <label class="footer-label">message</label>
          <textarea class="footer-textarea" placeholder="Write your message here..."></textarea>
        </div>
        <button class="send-btn">
          <span class="material-symbols-outlined">send</span> Send
        </button>
      </div>

    </div>
      <div class="footer-bottom">
    <hr class="footer-divider">
    <div class="footer-copy">© 2026 Biblioteca Mea — All rights reserved</div>
  </div>
  </div>
</footer>

</div>
  
  <script src="js/script.js"></script>
</body>
</html>