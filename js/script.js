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