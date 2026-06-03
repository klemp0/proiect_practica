function moveIndicator(btn) {
    var indicator = document.getElementById('navIndicator');
    indicator.style.left = btn.offsetLeft + 'px';
    indicator.style.width = btn.offsetWidth + 'px';
}

function showSection(section) {
    document.getElementById('addBooks').style.display = 'none';
    document.getElementById('myBooks').style.display = 'none';

    document.getElementById('btnAddBooks').classList.remove('active');
    document.getElementById('btnMyBooks').classList.remove('active');

    document.getElementById(section).style.display = 'block';

    if (section == 'addBooks') {
        var btn = document.getElementById('btnAddBooks');
        btn.classList.add('active');
        moveIndicator(btn);
    } else {
        var btn = document.getElementById('btnMyBooks');
        btn.classList.add('active');
        moveIndicator(btn);
    }
}

window.onload = function() {
    moveIndicator(document.getElementById('btnAddBooks'));
}

function toggleDropdown() {
    var dropdown = document.getElementById('navDropdown');
    if (dropdown.style.display == 'none') {
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
}

document.addEventListener('click', function(e) {
    var account = document.getElementById('navAccount');
    if (!account.contains(e.target)) {
        document.getElementById('navDropdown').style.display = 'none';
    }
});