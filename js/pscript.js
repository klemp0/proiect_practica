var allBooks = [];
var currentLang = {};

var CATEGORY_KEYS = {
    "Don't read": "cat_dont_read",
    "Reading": "cat_reading",
    "Want to read": "cat_want",
    "Finished": "cat_finished",
    "On hold": "cat_hold"
};

function categoryLabel(cat) {
    var key = CATEGORY_KEYS[cat];
    return (key && currentLang[key]) ? currentLang[key] : cat;
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    var icon = document.querySelector('.nav-btn .material-symbols-outlined[data-theme-icon]');
    if (icon) icon.textContent = (theme === 'dark') ? 'light_mode' : 'dark_mode';
}

function toggleTheme() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var newTheme = isDark ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
}

async function loadLang(lang) {
    var response = await fetch('lang/lang.json?t=' + Date.now());
    var data = await response.json();
    currentLang = data[lang] || data['en'];

    applyLang();

    var label = document.getElementById('langLabel');
    if (label) label.textContent = lang.toUpperCase();

    var stateEl = document.getElementById('categoryState');
    if (stateEl) {
        var val = stateEl.getAttribute('data-cat-value') || "Don't read";
        stateEl.textContent = categoryLabel(val);
    }

    renderBooks(allBooks);

    var activeTab = document.querySelector('.mybooks-tab.active');
    var filter = activeTab ? activeTab.getAttribute('data-filter') : 'all';
    renderMyBooks(allBooks, filter);
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

document.addEventListener('DOMContentLoaded', function() {
    var savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    loadLang(localStorage.getItem('lang') || 'en');
});

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

    if (section === 'addBooks') {
        closeModal();
        document.getElementById('addBooks').style.display = 'flex';
        var btn = document.getElementById('btnAddBooks');
        btn.classList.add('active');
        setTimeout(function() { moveIndicator(btn); }, 10);
    } else {
        document.getElementById('myBooks').style.display = 'block';
        var btn = document.getElementById('btnMyBooks');
        btn.classList.add('active');
        moveIndicator(btn);

        document.querySelectorAll('.mybooks-tab').forEach(function(t) {
            t.classList.remove('active');
        });
        var allTab = document.querySelector('.mybooks-tab[data-filter="all"]');
        allTab.classList.add('active');
        renderMyBooks(allBooks, 'all');

        setTimeout(function() {
            moveMybooksIndicator(allTab);
        }, 10);
    }
}

function moveMybooksIndicator(btn) {
    var indicator = document.getElementById('mybooksIndicator');
    var tabs = document.querySelector('.mybooks-tabs');
    var tabsRect = tabs.getBoundingClientRect();
    var btnRect = btn.getBoundingClientRect();
    indicator.style.left = (btnRect.left - tabsRect.left) + 'px';
    indicator.style.width = btnRect.width + 'px';
}

function toggleDropdown() {
    var dropdown = document.getElementById('navDropdown');
    dropdown.style.display = (dropdown.style.display === 'none') ? 'block' : 'none';
}

function toggleModal() {
    var modal = document.getElementById('addModal');
    var addBtn = document.getElementById('addBtn');
    var icon = addBtn.querySelector('.material-symbols-outlined');

    if (modal.style.display === 'none') {
        modal.style.display = 'block';
        icon.textContent = 'close';
    } else {
        modal.style.display = 'none';
        icon.textContent = 'add';
    }
}

function closeModal() {
    var modal = document.getElementById('addModal');
    var icon = document.getElementById('addBtn').querySelector('.material-symbols-outlined');
    modal.style.display = 'none';
    icon.textContent = 'add';
}

function toggleCatDropdown(event) {
    event.stopPropagation();
    var dropdown = document.getElementById('catDropdown');
    dropdown.style.display = (dropdown.style.display === 'none') ? 'block' : 'none';
}

function selectCategory(event, value) {
    event.preventDefault();
    var stateEl = document.getElementById('categoryState');
    stateEl.textContent = categoryLabel(value);
    stateEl.setAttribute('data-cat-value', value);
    document.getElementById('catDropdown').style.display = 'none';
}

function toggleCardCatDropdown(event, dropId) {
    event.stopPropagation();
    document.querySelectorAll('.cat-dropdown[id^="addCatDropdown-"], .cat-dropdown[id^="myCatDropdown-"]').forEach(function(d) {
        if (d.id !== dropId) d.style.display = 'none';
    });
    var dropdown = document.getElementById(dropId);
    if (dropdown) dropdown.style.display = (dropdown.style.display === 'none') ? 'block' : 'none';
}

function selectCardCategory(event, dropId, index, category) {
    event.preventDefault();
    var dropdown = document.getElementById(dropId);
    if (dropdown) dropdown.style.display = 'none';
    changeCategory(index, category);
}

var knownGenres = [
    'literary fiction', 'historical fiction', 'science fiction', 'dark fantasy',
    'epic fantasy', 'urban fantasy', 'psychological thriller', 'paranormal romance',
    'magical realism', 'young adult', 'coming of age', 'graphic novel', 'short stories',
    'non-fiction', 'true crime', 'popular science', 'personal development',
    'fantasy', 'mystery', 'thriller', 'crime', 'detective', 'horror',
    'gothic', 'romance', 'adventure', 'dystopian', 'utopian', 'satire', 'humor',
    'comedy', 'drama', 'tragedy', 'western', 'spy', 'suspense', 'action', 'war',
    'political', 'legal', 'medical', 'techno', 'mythology', 'folklore', 'fairy tale',
    'manga', 'anthology', 'novella', 'classic', 'paranormal', 'supernatural',
    'occult', 'cyberpunk', 'steampunk', 'biography', 'autobiography', 'memoir',
    'history', 'journalism', 'essay', 'philosophy', 'psychology', 'self-help',
    'science', 'mathematics', 'physics', 'politics', 'economics', 'sociology',
    'anthropology', 'religion', 'spirituality', 'theology', 'travel', 'nature',
    'environment', 'art', 'music', 'film', 'architecture', 'cooking', 'health',
    'fitness', 'medicine', 'business', 'finance', 'technology', 'education',
    'fiction'
];

var blacklist = [
    'in english', 'in french', 'in german', 'in spanish',
    'british and irish', 'american fiction', 'english fiction',
    'imaginary', 'place)', '(fic', 'translations'
];

async function searchBook(title, author) {
    var query = encodeURIComponent(title + ' ' + author);
    var url = 'https://openlibrary.org/search.json?q=' + query + '&limit=1&fields=title,author_name,cover_i,subject,subject_facet';

    try {
        var controller = new AbortController();
        var timeoutId = setTimeout(function() { controller.abort(); }, 5000);
        var response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        var data = await response.json();

        if (!data.docs || data.docs.length === 0) return null;

        var book = data.docs[0];
        var coverUrl = book.cover_i ? 'https://covers.openlibrary.org/b/id/' + book.cover_i + '-M.jpg' : null;

        var rawSubjects = book.subject || [];
        var genresSet = new Set();

        for (var i = 0; i < rawSubjects.length; i++) {
            var sub = rawSubjects[i].toLowerCase();
            var isBlacklisted = blacklist.some(function(b) { return sub.indexOf(b) !== -1; });
            if (isBlacklisted) continue;

            for (var j = 0; j < knownGenres.length; j++) {
                var genre = knownGenres[j];
                if (sub === genre || sub.indexOf(genre) !== -1) {
                    genresSet.add(genre.charAt(0).toUpperCase() + genre.slice(1));
                    break;
                }
            }
            if (genresSet.size >= 3) break;
        }

        return {
            title: book.title || title,
            author: book.author_name ? book.author_name[0] : author,
            cover: coverUrl,
            genres: Array.from(genresSet)
        };
    } catch (err) {
        return null;
    }
}

document.getElementById('addBookForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    var title = document.getElementById('title').value.trim();
    var author = document.getElementById('author').value.trim();
    var stateEl = document.getElementById('categoryState');
    var category = stateEl.getAttribute('data-cat-value') || "Don't read";

    if (title === '' || author === '') {
        alert(currentLang.alert_fill_fields || 'Please enter title and author.');
        return;
    }

    var submitBtn = this.querySelector('.submit-btn');
    submitBtn.textContent = currentLang.adding || 'Adding...';
    submitBtn.disabled = true;

    var bookData = await searchBook(title, author);
    if (!bookData) {
        bookData = { title: title, author: author, cover: null, genres: [] };
    }

    bookData.category = category;
    bookData.saved = false;

    await saveBook(bookData);

    document.getElementById('title').value = '';
    document.getElementById('author').value = '';

    stateEl.setAttribute('data-cat-value', "Don't read");
    stateEl.textContent = categoryLabel("Don't read");

    submitBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size:16px;">add</span> <span data-i18n="add_btn">' + (currentLang.add_btn || 'Add') + '</span>';
    submitBtn.disabled = false;

    closeModal();
    loadBooks();
});

async function saveBook(bookData) {
    var response = await fetch('php/save_data.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
    });
    return response.json();
}

async function loadBooks() {
    var response = await fetch('php/save_data.php?action=get&t=' + Date.now());
    allBooks = await response.json();
    renderBooks(allBooks);

    var activeTab = document.querySelector('.mybooks-tab.active');
    var filter = activeTab ? activeTab.getAttribute('data-filter') : 'all';
    renderMyBooks(allBooks, filter);
}

async function changeCategory(index, newCategory) {
    await fetch('php/save_data.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_category', index: index, category: newCategory })
    });
    loadBooks();
}

async function toggleSaved(index) {
    await fetch('php/save_data.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_saved', index: index })
    });
    loadBooks();
}

async function deleteBook(index) {
    await fetch('php/save_data.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', index: index })
    });
    loadBooks();
}

function renderBooks(books) {
    var list = document.getElementById('booksList');
    list.innerHTML = '';

    if (!books || books.length === 0) {
        list.innerHTML =
            '<div class="empty-msg">' +
                '<div class="empty-msg-title">' + (currentLang.no_books_title || 'No books added') + '</div>' +
                '<div class="empty-msg-sub">' + (currentLang.no_books_sub || 'Click add button to add a book') + '</div>' +
            '</div>';
        return;
    }

    books.forEach(function(book, index) {
        list.appendChild(createBookCard(book, index, 'add'));
    });
}

function renderMyBooks(books, filter) {
    var list = document.getElementById('myBooksList');
    list.innerHTML = '';

    var filtered = books.filter(function(book) {
        if (filter === 'all') return book.category !== "Don't read" || book.saved;
        if (filter === 'saved') return book.saved == true;
        return book.category === filter;
    });

    if (filtered.length === 0) {
        list.innerHTML =
            '<div class="empty-msg">' +
                '<div class="empty-msg-title">' + (currentLang.no_books_here_title || 'No books here') + '</div>' +
                '<div class="empty-msg-sub">' + (currentLang.no_books_here_sub || 'Add books or change their category') + '</div>' +
            '</div>';
        return;
    }

    filtered.forEach(function(book) {
        var index = allBooks.findIndex(function(b) {
            return b.title === book.title && b.author === book.author;
        });
        list.appendChild(createBookCard(book, index, 'my'));
    });
}

function createBookCard(book, index, prefix) {
    var dropId = (prefix || 'card') + 'CatDropdown-' + index;

    var card = document.createElement('div');
    card.className = 'book-card';

    var coverHtml = book.cover
        ? '<img src="' + book.cover + '" alt="cover" class="book-cover">'
        : '<div class="book-cover-placeholder"><span class="material-symbols-outlined">menu_book</span></div>';

    var genresHtml = '';
    if (book.genres && book.genres.length > 0) {
        book.genres.slice(0, 3).forEach(function(g) {
            genresHtml += '<span class="genre-tag">' + g + '</span>';
        });
    }

    var bookmarkIcon = book.saved ? 'bookmark' : 'bookmark_border';

    var categories = ["Don't read", "Reading", "Want to read", "Finished", "On hold"];
    var optionsHtml = categories.map(function(cat) {
        return '<a href="#" class="dropdown-item" onclick="selectCardCategory(event, \'' + dropId + '\', ' + index + ', this.getAttribute(\'data-cat\'))" data-cat="' + cat + '">' + categoryLabel(cat) + '</a>';
    }).join('');

    card.innerHTML = `
        ${coverHtml}
        <div class="book-info">
            <div class="book-top">
                <div>
                    <div class="book-title">${book.title}</div>
                    <div class="book-author">${book.author}</div>
                    <div class="book-genres">${genresHtml}</div>
                </div>
                <span class="material-symbols-outlined delete-btn" onclick="deleteBook(${index})">delete</span>
            </div>
            <div class="book-bottom">
                <div style="position:relative;">
                    <button type="button" class="category-btn" onclick="toggleCardCatDropdown(event, '${dropId}')">
                        <span>${categoryLabel(book.category)}</span>
                        <span class="material-symbols-outlined" style="font-size:18px;">arrow_drop_down</span>
                    </button>
                    <div class="cat-dropdown" id="${dropId}" style="display:none; left:auto; right:0;">
                        ${optionsHtml}
                    </div>
                </div>
                <span class="material-symbols-outlined bookmark-btn ${book.saved ? 'saved' : ''}" onclick="toggleSaved(${index})">${bookmarkIcon}</span>
            </div>
        </div>
    `;

    return card;
}

function filterBooks(filter, btn) {
    document.querySelectorAll('.mybooks-tab').forEach(function(t) {
        t.classList.remove('active');
    });
    btn.classList.add('active');
    moveMybooksIndicator(btn);
    renderMyBooks(allBooks, filter);
}

function openEditModal() {
    document.getElementById('navDropdown').style.display = 'none';
    document.getElementById('editOverlay').style.display = 'block';
    document.getElementById('editModal').style.display = 'flex';
    document.getElementById('editError').style.display = 'none';
    document.getElementById('editName').value = '';
    document.getElementById('editPassword').value = '';
}

function closeEditModal() {
    document.getElementById('editOverlay').style.display = 'none';
    document.getElementById('editModal').style.display = 'none';
}

async function submitEdit() {
    var name = document.getElementById('editName').value.trim();
    var password = document.getElementById('editPassword').value;
    var errorDiv = document.getElementById('editError');

    if (!name || !password) {
        errorDiv.textContent = currentLang.edit_fill_fields || 'Please fill in all fields.';
        errorDiv.style.display = 'block';
        return;
    }

    var response = await fetch('php/edit_profile.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, password: password })
    });

    var result = await response.json();

    if (result.success) {
        document.querySelector('.nav-username').textContent = name;
        closeEditModal();
    } else {
        errorDiv.textContent = result.error;
        errorDiv.style.display = 'block';
    }
}

document.addEventListener('click', function(e) {
    var account = document.getElementById('navAccount');
    if (account && !account.contains(e.target)) {
        document.getElementById('navDropdown').style.display = 'none';
    }

    var catBtn = document.getElementById('categoryBtn');
    if (catBtn && !catBtn.contains(e.target)) {
        var catDrop = document.getElementById('catDropdown');
        if (catDrop) catDrop.style.display = 'none';
    }

    document.querySelectorAll('.cat-dropdown[id^="addCatDropdown-"], .cat-dropdown[id^="myCatDropdown-"]').forEach(function(d) {
        var btn = d.previousElementSibling;
        if (!d.contains(e.target) && btn && !btn.contains(e.target)) {
            d.style.display = 'none';
        }
    });

    var modal = document.getElementById('addModal');
    var addBtn = document.getElementById('addBtn');
    if (modal && modal.style.display !== 'none') {
        if (!modal.contains(e.target) && !addBtn.contains(e.target)) {
            closeModal();
        }
    }

    var langWrap = document.getElementById('langBtnWrap');
    if (langWrap && !langWrap.contains(e.target)) {
        var langDrop = document.getElementById('langDropdown');
        if (langDrop) langDrop.style.display = 'none';
    }
});

window.onload = function() {
    moveIndicator(document.getElementById('btnAddBooks'));
    loadBooks().then(function() {
        moveMybooksIndicator(document.querySelector('.mybooks-tab.active'));
    });
};

window.addEventListener('resize', function() {
    var activeNavBtn = document.querySelector('.nav-link.active');
    if (activeNavBtn) moveIndicator(activeNavBtn);

    var activeMybooksTab = document.querySelector('.mybooks-tab.active');
    if (activeMybooksTab) moveMybooksIndicator(activeMybooksTab);
});

var toastTimeout;
 
function showToast(message, type) {
    var toast = document.getElementById('feedbackToast');
    if (!toast) return;
 
    clearTimeout(toastTimeout);
 
    toast.textContent = message;
    toast.className = 'toast ' + type; 

    requestAnimationFrame(function() {
        toast.classList.add('show');
    });

    toastTimeout = setTimeout(function() {
        toast.classList.remove('show');
    }, 3000);
}

function validateEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
 
async function submitFeedback() {
    var emailInput = document.getElementById('feedbackEmail');
    var messageInput = document.getElementById('feedbackMessage');
 
    var email = emailInput.value.trim();
    var message = messageInput.value.trim();

    if (email === '' || message === '') {
        showToast(currentLang.feedback_fill_fields || 'Please fill in all fields.', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showToast(currentLang.feedback_invalid_email || 'Please enter a valid email address.', 'error');
        return;
    }
 
    var response = await fetch('php/feedback.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, message: message })
    });
 
    var result = await response.json();
 
    if (result.success) {
        showToast(currentLang.feedback_success || 'Thank you! Your message has been sent.', 'success');
        emailInput.value = '';
        messageInput.value = '';
    } else if (result.error === 'fill_fields') {
        showToast(currentLang.feedback_fill_fields || 'Please fill in all fields.', 'error');
    } else if (result.error === 'invalid_email') {
        showToast(currentLang.feedback_invalid_email || 'Please enter a valid email address.', 'error');
    }
}
