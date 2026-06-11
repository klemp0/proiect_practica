var currentLang = {};

async function loadLang(lang) {
    var response = await fetch('lang/lang.json?t=' + Date.now());
    var data = await response.json();
    currentLang = data[lang] || data['en'];
    applyLang();
    var label = document.getElementById('langLabel');
    if (label) label.textContent = lang.toUpperCase();
}

function applyLang() {
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
        var key = el.getAttribute('data-i18n');
        if (currentLang[key]) el.textContent = currentLang[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
        var key = el.getAttribute('data-i18n-placeholder');
        if (currentLang[key]) el.placeholder = currentLang[key];
    });
}

function toggleLangDropdown() {
    var dropdown = document.getElementById('langDropdown');
    dropdown.style.display = (dropdown.style.display === 'none') ? 'block' : 'none';
}

function setLang(event, lang) {
    event.preventDefault();
    event.stopPropagation();
    localStorage.setItem('lang', lang);
    document.getElementById('langDropdown').style.display = 'none';
    loadLang(lang);
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    var icon = document.querySelector('.theme-btn .material-symbols-outlined');
    if (icon) icon.textContent = (theme === 'dark') ? 'light_mode' : 'dark_mode';

    var bgImg = document.getElementById('landingBg');
    if (bgImg) {
        bgImg.src = (theme === 'dark') ? 'img/landing_bg_dark.png' : 'img/landing_bg.jpg';
    }
}

function toggleTheme() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var newTheme = isDark ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
}

document.addEventListener('DOMContentLoaded', function() {
    applyTheme(localStorage.getItem('theme') || 'light');
    loadLang(localStorage.getItem('lang') || 'en');
});

document.addEventListener('click', function(e) {
    var wrap = document.getElementById('langBtnWrap');
    if (wrap && !wrap.contains(e.target)) {
        var dropdown = document.getElementById('langDropdown');
        if (dropdown) dropdown.style.display = 'none';
    }
});

function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function showLogin() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

function togglePassword(inputId, icon) {
    var input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
        icon.textContent = "visibility_off";
    } else {
        input.type = "password";
        icon.textContent = "visibility";
    }
}

function toggleRegisterPasswords(icon) {
    var password = document.getElementById("registerPassword");
    var repeat = document.getElementById("repeatPassword");
    if (password.type === "password") {
        password.type = "text";
        repeat.type = "text";
        icon.textContent = "visibility_off";
    } else {
        password.type = "password";
        repeat.type = "password";
        icon.textContent = "visibility";
    }
}

document.addEventListener("click", function(e) {
    if (!e.target.closest(".password-box")) {
        var login = document.getElementById("loginPassword");
        if (login) login.type = "password";
        var register = document.getElementById("registerPassword");
        var repeat = document.getElementById("repeatPassword");
        if (register) register.type = "password";
        if (repeat) repeat.type = "password";
        document.querySelectorAll(".password-icon").forEach(function(icon) {
            icon.textContent = "visibility";
        });
    }
});

if (window.location.search.indexOf('form=register') !== -1) {
    showRegister();
    window.history.replaceState({}, document.title, '/proiect_practica/index.php');
}

document.getElementById('registerForm').querySelector('form').onsubmit = function(e) {
    var name = document.querySelector('#registerForm input[name="name"]').value;
    var email = document.querySelector('#registerForm input[name="email"]').value;
    var password = document.querySelector('#registerForm input[name="password"]').value;
    var repeat = document.querySelector('#registerForm input[name="repeat_password"]').value;

    var old = document.getElementById('register-error');
    if (old) old.remove();

    var error = '';
    var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (name == '' || email == '' || password == '' || repeat == '') {
        error = 'Please fill in all fields.';
    } else if (!emailRegex.test(email)) {
        error = 'Invalid email address.';
    } else if (password.length < 8) {
        error = 'Password is too short. At least 8 characters.';
    } else if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        error = 'Password must include uppercase, lowercase and a number.';
    } else if (password != repeat) {
        error = 'Passwords do not match.';
    }

    if (error != '') {
        e.preventDefault();
        var div = document.createElement('div');
        div.id = 'register-error';
        div.className = 'error-msg';
        div.textContent = error;
        document.querySelector('#registerForm form').prepend(div);
    }
};

document.getElementById('loginForm').querySelector('form').onsubmit = function(e) {
    var email = document.querySelector('#loginForm input[name="email"]').value;
    var password = document.querySelector('#loginForm input[name="password"]').value;

    var old = document.getElementById('login-error');
    if (old) old.remove();

    var error = '';
    if (email == '' || password == '') {
        error = 'Please fill in all fields.';
    }

    if (error != '') {
        e.preventDefault();
        var div = document.createElement('div');
        div.id = 'login-error';
        div.className = 'error-msg';
        div.textContent = error;
        document.querySelector('#loginForm form').prepend(div);
    }
};