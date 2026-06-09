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
        document.getElementById('addBooks').style.display = 'block';
        var btn = document.getElementById('btnAddBooks');
        btn.classList.add('active');
        moveIndicator(btn);
    } else {
        document.getElementById('myBooks').style.display = 'block';
        var btn = document.getElementById('btnMyBooks');
        btn.classList.add('active');
        moveIndicator(btn);
    }
}

window.onload = function() {
    moveIndicator(document.getElementById('btnAddBooks'));
    loadBooks();
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
    document.getElementById('categoryState').textContent = value;
    document.getElementById('catDropdown').style.display = 'none';
}

function toggleCardCatDropdown(event, index) {
    event.stopPropagation();
    document.querySelectorAll('.cat-dropdown[id^="cardCatDropdown-"]').forEach(function(d) {
        if (d.id !== 'cardCatDropdown-' + index) d.style.display = 'none';
    });
    var dropdown = document.getElementById('cardCatDropdown-' + index);
    dropdown.style.display = (dropdown.style.display === 'none') ? 'block' : 'none';
}

function selectCardCategory(event, index, category) {
    event.preventDefault();
    document.getElementById('cardCatDropdown-' + index).style.display = 'none';
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
    var category = document.getElementById('categoryState').textContent;

    if (title === '' || author === '') {
        alert('Please enter title and author.');
        return;
    }

    var submitBtn = this.querySelector('.submit-btn');
    submitBtn.textContent = 'Adding...';
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
    document.getElementById('categoryState').textContent = "Don't read";
    submitBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size:16px;">add</span> Add';
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
    var books = await response.json();
    renderBooks(books);
}

function renderBooks(books) {
    var list = document.getElementById('booksList');
    list.innerHTML = '';

    if (books.length === 0) {
        list.innerHTML = `
            <div class="empty-msg">
                <div class="empty-msg-title">No books added</div>
                <div class="empty-msg-sub">Click add button to add a book</div>
            </div>
        `;
        return;
    }

    books.forEach(function(book, index) {
        list.appendChild(createBookCard(book, index));
    });
}

function createBookCard(book, index) {
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
        return '<a href="#" class="dropdown-item" onclick="selectCardCategory(event, ' + index + ', \'' + cat + '\')">' + cat + '</a>';
    }).join('');

    card.innerHTML = `
        ${coverHtml}
        <div class="book-info">
            <div class="book-title">${book.title}</div>
            <div class="book-author">${book.author}</div>
            <div class="book-genres">${genresHtml}</div>
        </div>
        <div class="book-actions">
            <div style="position:relative;">
                <button type="button" class="category-btn" onclick="toggleCardCatDropdown(event, ${index})">
                    <span>${book.category}</span>
                    <span class="material-symbols-outlined" style="font-size:18px;">arrow_drop_down</span>
                </button>
                <div class="cat-dropdown" id="cardCatDropdown-${index}" style="display:none; left:auto; right:0;">
                    ${optionsHtml}
                </div>
            </div>
            <span class="material-symbols-outlined bookmark-btn" onclick="toggleSaved(${index})">${bookmarkIcon}</span>
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

    document.querySelectorAll('.cat-dropdown[id^="cardCatDropdown-"]').forEach(function(d) {
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
});