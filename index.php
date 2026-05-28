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
    <div class="auth-card">
        <div class="card-title" id="cardTitle">Enter Your Account</div>
        <div class="tab-switcher">
          <button class="tab-btn active" id="loginTab">Log In</button>
          <button class="tab-btn" id="registerTab">Register</button>
        </div>
         <div class="form-group name-group" id="nameGroup">
          <label class="form-label">Name</label>
          <input class="form-input" type="text" placeholder="Your name">
        </div>
         <div class="form-group">
          <label class="form-label">E-mail</label>
          <input class="form-input" type="email" placeholder="email@example.com">
        </div>
         <div class="form-group">
          <label class="form-label">Password</label>
          <input class="form-input" type="password" placeholder="••••••••">
        </div>
         <a href="#" class="forgot-link" id="forgotLink">Forgot the password?</a>
         <button class="submit-btn" id="submitBtn">➔ Log In</button>
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
  
</body>
</html>