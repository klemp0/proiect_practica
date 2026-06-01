function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function showLogin() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

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
        error = 'Invalid email address. Forbidden characters or wrong format.';
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