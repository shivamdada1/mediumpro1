console.log("MediumPro script loaded.");

// --- Mock Data (from previous steps) ---
const mockUser = {
    interests: ['Technology', 'Programming', 'Web Development', 'AI']
};

const mockArticles = [
    {
        id: 1,
        title: "The Future of AI in Web Development",
        excerpt: "Exploring how artificial intelligence is reshaping the landscape of web development, from automated coding to personalized user experiences.",
        author: { name: "Dr. Ada Lovelace", avatar: "https://via.placeholder.com/40?text=AL", verified: true },
        claps: 1250,
        freshness: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        tags: ["AI", "Web Development", "Technology", "Future Tech"],
        readingTime: "7 min read"
    },
    {
        id: 2,
        title: "Mastering JavaScript Promises",
        excerpt: "A deep dive into JavaScript Promises, async/await, and how to handle asynchronous operations like a pro.",
        author: { name: "Brendan Eich", avatar: "https://via.placeholder.com/40?text=BE", verified: false },
        claps: 850,
        freshness: new Date(Date.now() - 36 * 60 * 60 * 1000), // 36 hours ago
        tags: ["JavaScript", "Programming", "Web Development"],
        readingTime: "10 min read"
    },
    {
        id: 3,
        title: "A Guide to Minimalist Design Principles",
        excerpt: "Discover the core principles of minimalist design and how to apply them to create clean, elegant, and user-friendly interfaces.",
        author: { name: "Dieter Rams", avatar: "https://via.placeholder.com/40?text=DR", verified: true },
        claps: 2100,
        freshness: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        tags: ["Design", "UI/UX", "Minimalism"],
        readingTime: "5 min read"
    },
    {
        id: 4,
        title: "Getting Started with Python for Data Science",
        excerpt: "An introductory guide to using Python and its popular libraries like Pandas and NumPy for data analysis and visualization.",
        author: { name: "Guido van Rossum", avatar: "https://via.placeholder.com/40?text=GVR", verified: true },
        claps: 1500,
        freshness: new Date(Date.now() - 72 * 60 * 60 * 1000), // 3 days ago
        tags: ["Python", "Data Science", "Programming", "Technology"],
        readingTime: "12 min read"
    },
    {
        id: 5,
        title: "The Importance of Semantic HTML",
        excerpt: "Why using semantic HTML is crucial for accessibility, SEO, and maintainable code.",
        author: { name: "Tim Berners-Lee", avatar: "https://via.placeholder.com/40?text=TBL", verified: true },
        claps: 950,
        freshness: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
        tags: ["HTML", "Web Development", "Accessibility", "Best Practices"],
        readingTime: "6 min read"
    }
];

// --- Algorithmic Feed Logic (from previous steps) ---
function rank_articles(user, articles) {
    const ranked = articles.map(article => {
        const maxFreshnessHours = 7 * 24;
        const hoursSincePublication = (Date.now() - article.freshness.getTime()) / (1000 * 60 * 60);
        let freshnessScore = Math.max(0, (maxFreshnessHours - hoursSincePublication) / maxFreshnessHours) * 100;
        const commonTags = article.tags.filter(tag => user.interests.includes(tag));
        const commonTagsCount = commonTags.length;
        let score = (article.claps * 0.6) + (freshnessScore * 0.3) + (commonTagsCount * 0.4);
        if (article.author.verified) {
            score *= 1.2;
        }
        return { ...article, score };
    });
    return ranked.sort((a, b) => b.score - a.score);
}

function getTrendingArticles(articles, hours = 24) {
    const timeLimit = Date.now() - hours * 60 * 60 * 1000;
    const recentArticles = articles.filter(article => article.freshness.getTime() >= timeLimit);
    return recentArticles.sort((a, b) => b.claps - a.claps);
}

// --- DOM Rendering Logic (from previous steps) ---
function createArticleCardHTML(article) {
    const formattedDate = article.freshness.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });
    const commentCount = Math.floor(Math.random() * 50);
    return `
        <div class="article-card-item" data-id="${article.id}">
            <div class="article-tags">
                ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <h3 class="article-title-feed"><a href="article.html?id=${article.id}">${article.title}</a></h3>
            <p class="article-excerpt-feed">${article.excerpt}</p>
            <div class="author-section-feed">
                <img src="${article.author.avatar}" alt="${article.author.name}" class="author-avatar-feed">
                <div class="author-details-feed">
                    <span class="author-name-feed">${article.author.name} ${article.author.verified ? '<span class="verified-badge">✔</span>' : ''}</span>
                    <button class="follow-button-feed" data-author-id="${article.author.name}">Follow</button>
                </div>
            </div>
            <div class="article-meta-feed">
                <span class="publish-date">${formattedDate}</span>
                <span class="separator">·</span>
                <span class="read-time">${article.readingTime}</span>
            </div>
            <div class="action-buttons-feed">
                <button class="button-feed clap-button-feed" aria-label="Clap for this article">👏 <span class="count">${article.claps}</span></button>
                <button class="button-feed comment-button-feed" aria-label="Comment on this article">💬 <span class="count">${commentCount}</span></button>
                <button class="button-feed bookmark-button-feed" aria-label="Bookmark this article">🔖</button>
                <button class="button-feed share-button-feed" aria-label="Share this article">🔗</button>
            </div>
        </div>
    `;
}

function renderArticles(articles, containerSelector = '.articles-list-container') {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.error("Article container not found:", containerSelector);
        return;
    }
    container.innerHTML = articles.map(createArticleCardHTML).join('');
}

// --- Button Interactivity Functions ---
function toggleFollowButton(button) {
    if (button.textContent === 'Follow') {
        button.textContent = 'Following';
        button.classList.add('following');
    } else {
        button.textContent = 'Follow';
        button.classList.remove('following');
    }
}

function incrementClap(clapButton) {
    const countElement = clapButton.querySelector('.count');
    if (countElement) {
        let currentClaps = parseInt(countElement.textContent, 10);
        currentClaps++;
        countElement.textContent = currentClaps;
        clapButton.classList.add('clapped-animation');
        setTimeout(() => {
            clapButton.classList.remove('clapped-animation');
        }, 300);
    }
}

function toggleBookmarkButton(bookmarkButton) {
    bookmarkButton.classList.toggle('bookmarked');
}


// --- DOMContentLoaded - Enhanced ---
document.addEventListener('DOMContentLoaded', () => {
    // Existing theme loading logic
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    const darkModeToggleButton = document.querySelector('.dark-mode-toggle');

    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }
    // Icon state is handled by CSS based on body.dark-mode class

    // Dark Mode Toggle Button - Event Listener
    if (darkModeToggleButton) {
        darkModeToggleButton.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
            // Icon state is handled by CSS
        });
    }

    // Reading Progress Bar for article pages
    const progressBar = document.getElementById('articleProgressBar');
    const mainContentForProgressBar = document.querySelector('.main-article-content');
    if (progressBar && mainContentForProgressBar) {
        window.addEventListener('scroll', () => {
            const contentTop = mainContentForProgressBar.offsetTop;
            const contentHeight = mainContentForProgressBar.scrollHeight;
            const windowHeight = window.innerHeight;
            const scrollY = window.scrollY;
            let progress = 0;
            if (scrollY > contentTop) {
                const scrolledPastContentTop = scrollY - contentTop;
                const scrollableRange = contentHeight - windowHeight;
                if (scrollableRange <= 0) {
                    progress = 100;
                } else {
                    progress = (scrolledPastContentTop / scrollableRange) * 100;
                }
            }
            progress = Math.min(Math.max(progress, 0), 100);
            progressBar.style.width = progress + '%';
        });
    }

    // Article feed rendering and tab logic (only if on index page - .feed-content exists)
    const feedContentArea = document.querySelector('.feed-content');
    if (feedContentArea) {
        const personalizedFeed = rank_articles(mockUser, mockArticles);
        renderArticles(personalizedFeed); // Initial render

        const tabs = document.querySelectorAll('.tab-button');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                if (tab.classList.contains('active')) return;

                const currentActiveTab = document.querySelector('.tab-button.active');
                if (currentActiveTab) {
                    currentActiveTab.classList.remove('active');
                }
                tab.classList.add('active');
                const tabType = tab.dataset.tab;

                if (tabType === 'for-you') {
                    renderArticles(rank_articles(mockUser, mockArticles));
                } else if (tabType === 'trending') {
                    renderArticles(getTrendingArticles(mockArticles));
                }
            });
        });

        // Event delegation for dynamically created buttons within articles list
        const articlesListContainer = document.querySelector('.articles-list-container');
        if (articlesListContainer) {
            articlesListContainer.addEventListener('click', function(event) {
                const target = event.target;

                if (target.matches('.follow-button-feed') || target.closest('.follow-button-feed')) {
                    toggleFollowButton(target.closest('.follow-button-feed') || target);
                }
                if (target.matches('.clap-button-feed') || target.closest('.clap-button-feed')) {
                    incrementClap(target.closest('.clap-button-feed'));
                }
                if (target.matches('.bookmark-button-feed') || target.closest('.bookmark-button-feed')) {
                    toggleBookmarkButton(target.closest('.bookmark-button-feed'));
                }
            });
        }
    }

    // Event delegation for sidebar follow buttons
    const rightSidebar = document.querySelector('.right-sidebar');
    if (rightSidebar) {
        rightSidebar.addEventListener('click', function(event) {
            if (event.target.matches('.follow-button-sidebar')) {
                toggleFollowButton(event.target);
            }
        });
    }
}); // End of DOMContentLoaded
