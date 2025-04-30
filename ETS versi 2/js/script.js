let allNewsData = [];

async function loadNews() {
    try {
        const response = await fetch('data/berita.json');
        allNewsData = await response.json();
        
        // Initial display - show all featured and regular news
        displayFeaturedNews(allNewsData.filter(item => item.isFeatured));
        displayAllNews(allNewsData);
    } catch (error) {
        console.error('Error loading news:', error);
    }
}

function filterCategory(category) {
    if (category === 'Beranda' || !category) {
        window.location.href = 'index.html';
    } else {
        window.location.href = `category.html?category=${encodeURIComponent(category)}`;
    }
}

async function loadCategoryPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (!category) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch('data/berita.json');
        const allNews = await response.json();
        const filteredNews = allNews.filter(news => news.category === category);
        
        // Show featured news from category
        const featuredInCategory = filteredNews.filter(item => item.isFeatured);
        displayFeaturedNews(featuredInCategory);
        displayAllNews(filteredNews);
        
        // Update page title and heading
        document.title = `${category} - News Portal`;
        document.querySelector('.all-news h2').textContent = `Berita ${category}`;
        
        // Update active state in navigation
        updateActiveNavigation(category);
    } catch (error) {
        console.error('Error loading category:', error);
    }
}

function updateActiveNavigation(category) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to selected category
    if (category) {
        const activeLink = document.querySelector(`.nav-menu a[onclick*="${category}"]`);
        if (activeLink) activeLink.classList.add('active');
    }
}

function displayFeaturedNews(featuredNews) {
    const container = document.getElementById('featured-container');
    
    if (featuredNews.length === 0) {
        container.innerHTML = '<p class="no-featured">Tidak ada berita utama dalam kategori ini</p>';
        return;
    }

    container.innerHTML = featuredNews.map(news => `
        <article class="featured-card">
            <img src="${news.thumbnail}" alt="${news.title}" onclick="goToNewsDetail(${news.id})">
            <div class="card-content">
                <h3 onclick="goToNewsDetail(${news.id})" style="cursor: pointer">${news.title}</h3>
                <p>${news.summary}</p>
                <div class="meta">
                    <span class="category">${news.category}</span>
                    <span class="author">${news.author}</span>
                    <span class="date">${formatDate(news.date)}</span>
                </div>
            </div>
        </article>
    `).join('');
}

function displayAllNews(newsItems) {
    const container = document.getElementById('news-container');
    
    if (newsItems.length === 0) {
        container.innerHTML = '<p class="no-news">Tidak ada berita dalam kategori ini</p>';
        return;
    }

    container.innerHTML = newsItems.map(news => `
        <article class="news-card">
            <img src="${news.thumbnail}" alt="${news.title}" onclick="goToNewsDetail(${news.id})">
            <div class="card-content">
                <h3 onclick="goToNewsDetail(${news.id})" style="cursor: pointer">${news.title}</h3>
                <p>${news.summary}</p>
                <div class="meta">
                    <span class="category">${news.category}</span>
                    <span class="author">${news.author}</span>
                    <span class="date">${formatDate(news.date)}</span>
                </div>
            </div>
        </article>
    `).join('');
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

function performSearch() {
    const searchQuery = document.getElementById('search').value.toLowerCase();
    if (searchQuery.trim() === '') {
        alert('Silakan masukkan kata kunci pencarian');
        return;
    }
    window.location.href = `search.html?q=${encodeURIComponent(searchQuery)}`;
}

async function displaySearchResults() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');
    
    if (!searchQuery) {
        return;
    }

    try {
        const response = await fetch('data/berita.json');
        const news = await response.json();
        
        const results = news.filter(item => 
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.summary.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const container = document.getElementById('search-results-container');
        
        if (results.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <p>Tidak ada hasil untuk pencarian "${searchQuery}"</p>
                    <p>Silakan coba dengan kata kunci lain</p>
                </div>
            `;
            return;
        }

        container.innerHTML = results.map(news => `
            <article class="news-card">
                <img src="${news.thumbnail}" alt="${news.title}" onclick="goToNewsDetail(${news.id})" style="cursor: pointer;">
                <div class="card-content">
                    <h3 onclick="goToNewsDetail(${news.id})" style="cursor: pointer">${news.title}</h3>
                    <p>${news.summary}</p>
                    <div class="meta">
                        <span class="category">${news.category}</span>
                        <span class="author">${news.author}</span>
                        <span class="date">${formatDate(news.date)}</span>
                    </div>
                </div>
            </article>
        `).join('');

        // Update the heading to show search query
        document.querySelector('.search-results h2').textContent = 
            `Hasil Pencarian untuk "${searchQuery}"`;

    } catch (error) {
        console.error('Error loading search results:', error);
    }
}

function goToNewsDetail(newsId) {
    window.location.href = `news-detail.html?id=${newsId}`;
}

async function loadNewsDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get('id');
    
    if (!newsId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch('data/berita.json');
        const news = await response.json();
        const newsItem = news.find(item => item.id === parseInt(newsId));

        if (!newsItem) {
            window.location.href = 'index.html';
            return;
        }

        const container = document.getElementById('news-detail-container');
        container.innerHTML = `
            <article class="news-detail-header">
                <h1>${newsItem.title}</h1>
                <div class="news-detail-meta">
                    <span class="category">${newsItem.category}</span>
                    <span class="author">By ${newsItem.author}</span>
                    <span class="date">${formatDate(newsItem.date)}</span>
                </div>
            </article>
            <div class="news-detail-summary">
                ${newsItem.summary}
            </div>
            <img src="${newsItem.image}" alt="${newsItem.title}" class="news-detail-image">
            <div class="news-detail-content">
                ${newsItem.content}
            </div>
        `;

        document.title = `${newsItem.title} - News Portal`;
    } catch (error) {
        console.error('Error loading news detail:', error);
        container.innerHTML = '<p class="error">Gagal memuat artikel. Silakan coba lagi nanti.</p>';
    }
}

function loadCategoryNews(category) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = ''; // Clear existing content
    
    // Update category title
    const categoryTitle = document.getElementById('selected-category');
    if (categoryTitle) {
        categoryTitle.textContent = category;
    }

    // Filter news by category
    const categoryNews = allNews.filter(news => 
        category === 'All' ? true : news.category === category
    );

    // Display filtered news
    categoryNews.forEach(news => {
        const newsCard = createNewsCard(news);
        newsContainer.appendChild(newsCard);
    });
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('news-detail.html')) {
        loadNewsDetail();
    } else if (window.location.pathname.includes('search.html')) {
        displaySearchResults();
    } else if (window.location.pathname.includes('category.html')) {
        loadCategoryPage();
    } else {
        loadNews(); // For the main page
    }
});

// Add event listener for search input (Enter key)
document.getElementById('search')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});
