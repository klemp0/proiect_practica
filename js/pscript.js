// ==================== NAVBAR ====================

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

    document.getElementById(section).style.display = 'flex';

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
    loadBooks(); // incarca cartile salvate la pornire
}

function toggleDropdown() {
    var dropdown = document.getElementById('navDropdown');
    if (dropdown.style.display == 'none') {
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
}

// ==================== MODAL ADAUGA CARTE ====================

function toggleModal() {
    var modal = document.getElementById('bookModal');
    var addBtn = document.getElementById('addBtn');

    if (modal.style.display === 'none') {
        modal.style.display = 'flex';
        addBtn.querySelector('.material-symbols-outlined').textContent = 'close';
    } else {
        modal.style.display = 'none';
        addBtn.querySelector('.material-symbols-outlined').textContent = 'add';
    }
}

function toggleCatDropdown(event) {
    event.stopPropagation();
    var dropdown = document.getElementById('catDropdown');
    if (dropdown.style.display === 'none') {
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
}

function selectCategory(event, value) {
    event.preventDefault();
    document.getElementById('categoryState').textContent = value;
    document.getElementById('catDropdown').style.display = 'none';
}

// ==================== OPEN LIBRARY API ====================

// Cauta cartea dupa titlu si autor, returneaza date despre ea
async function searchBook(title, author) {
    // Construim query-ul de cautare
    var query = encodeURIComponent(title + ' ' + author);
    var url = 'https://openlibrary.org/search.json?q=' + query + '&limit=1';

    var response = await fetch(url);
    var data = await response.json();

    // Daca nu gasim nimic, returnam null
    if (!data.docs || data.docs.length === 0) {
        return null;
    }

    var book = data.docs[0];

    // Coperta: Open Library o da dupa cover_i (id-ul copertei)
    var coverUrl = null;
    if (book.cover_i) {
        coverUrl = 'https://covers.openlibrary.org/b/id/' + book.cover_i + '-M.jpg';
    }

    // Genuri: Open Library le numeste "subject"
    var genres = [];
    if (book.subject && book.subject.length > 0) {
        // Luam primele 3 genuri ca sa nu fie prea multe
        genres = book.subject.slice(0, 3);
    }

    // Rating: Open Library nu are rating propriu-zis,
    // dar are ratings_average daca exista
    var rating = null;
    if (book.ratings_average) {
        rating = Math.round(book.ratings_average * 10) / 10; // rotunjim la 1 zecimala
    }

    return {
        title: book.title || title,
        author: book.author_name ? book.author_name[0] : author,
        cover: coverUrl,
        genres: genres,
        rating: rating
    };
}

// ==================== SUBMIT FORMULAR ====================

document.getElementById('addBookForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // oprim submit-ul normal al formularului

    var title = document.getElementById('title').value.trim();
    var author = document.getElementById('author').value.trim();
    var category = document.getElementById('categoryState').textContent;

    // Validare simpla
    if (title === '' || author === '') {
        alert('Please enter title and author.');
        return;
    }

    // Aratam ca incarcam
    var submitBtn = this.querySelector('.submit-btn');
    submitBtn.textContent = 'Searching...';
    submitBtn.disabled = true;

    // Cautam cartea prin API
    var bookData = await searchBook(title, author);

    // Daca API nu a gasit cartea, cream datele manual
    if (!bookData) {
        bookData = {
            title: title,
            author: author,
            cover: null,
            genres: [],
            rating: null
        };
    }

    // Adaugam categoria aleasa de utilizator
    bookData.category = category;
    bookData.saved = false; // bookmark off by default

    // Salvam cartea pe server (PHP)
    await saveBook(bookData);

    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('categoryState').textContent = "Don't read";
    submitBtn.textContent = 'Add';
    submitBtn.disabled = false;

    toggleModal();

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
    var response = await fetch('php/save_data.php?action=get');
    var books = await response.json();
    renderBooks(books);
}

function renderBooks(books) {
    var list = document.getElementById('booksList');
    list.innerHTML = '';
    if (books.length === 0) {
        list.innerHTML = '<div style="color:#B8926A; font-size:14px;">No books yet. Add your first book!</div>';
        return;
    }

    books.forEach(function(book, index) {
        var card = createBookCard(book, index);
        list.appendChild(card);
    });
}

function createBookCard(book, index) {
    var card = document.createElement('div');
    card.className = 'book-card';

    var coverHtml = '';
    if (book.cover) {
        coverHtml = '<img src="' + book.cover + '" alt="cover" class="book-cover">';
    } else {
        coverHtml = '<div class="book-cover-placeholder"><span class="material-symbols-outlined">menu_book</span></div>';
    }

    var genresHtml = '';
    if (book.genres && book.genres.length > 0) {
        book.genres.slice(0, 2).forEach(function(g) {
            genresHtml += '<span class="genre-tag">' + g + '</span>';
        });
    }

    var ratingHtml = '';
    if (book.rating) {
        var stars = Math.round(book.rating / 2);
        for (var i = 1; i <= 5; i++) {
            ratingHtml += '<span class="material-symbols-outlined star ' + (i <= stars ? 'star-filled' : 'star-empty') + '">star</span>';
        }
    } else {
        for (var i = 1; i <= 5; i++) {
            ratingHtml += '<span class="material-symbols-outlined star star-empty">star</span>';
        }
    }

    var bookmarkFilled = book.saved ? 'bookmark' : 'bookmark_border';

    card.innerHTML = `
        ${coverHtml}
        <div class="book-info">
            <div class="book-title">${book.title}</div>
            <div class="book-author">${book.author}</div>
            <div class="book-genres">${genresHtml}</div>
            <div class="book-rating">${ratingHtml}</div>
        </div>
        <div class="book-actions">
            <select class="category-select" onchange="changeCategory(${index}, this.value)">
                <option ${book.category === "Don't read" ? 'selected' : ''}>Don't read</option>
                <option ${book.category === 'Reading' ? 'selected' : ''}>Reading</option>
                <option ${book.category === 'Want to read' ? 'selected' : ''}>Want to read</option>
                <option ${book.category === 'Finished' ? 'selected' : ''}>Finished</option>
                <option ${book.category === 'On hold' ? 'selected' : ''}>On hold</option>
            </select>
            <span class="material-symbols-outlined bookmark-btn" onclick="toggleSaved(${index})">${bookmarkFilled}</span>
            <span class="material-symbols-outlined delete-btn" onclick="deleteBook(${index})">delete</span>
        </div>
    `;

    return card;
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
    if (!confirm('Delete this book?')) return;
    await fetch('php/save_data.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', index: index })
    });
    loadBooks();
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
});