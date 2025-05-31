console.log("MediumPro script loaded.");

// Dark Mode Toggle (will be moved to a dedicated step/function later for clarity)
const themeToggleButton = document.querySelector('.dark-mode-toggle');
if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        // Optional: Save preference to localStorage
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeToggleButton.textContent = "Toggle Light";
        } else {
            localStorage.setItem('theme', 'light');
            themeToggleButton.textContent = "Toggle Dark";
        }
    });
}

// Apply saved theme on load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggleButton) themeToggleButton.textContent = "Toggle Light";
    } else {
        if (themeToggleButton) themeToggleButton.textContent = "Toggle Dark";
    }

    // Reading Progress Bar
    const progressBar = document.getElementById('articleProgressBar');
    const articleBody = document.querySelector('.article-body'); // Assuming this is the main scrollable content of the article

    if (progressBar && articleBody) {
        window.addEventListener('scroll', () => {
            // Calculate the scrollable height of the article body itself
            // This requires the articleBody to be the element that overflows if the page is long,
            // or adjust to documentElement.scrollHeight if the whole page scrolls.
            // For simplicity, let's assume window scroll represents article scroll progress relative to viewport.

            const mainContent = document.querySelector('.main-article-content');
            if (!mainContent) return;

            const contentTop = mainContent.offsetTop;
            const contentHeight = mainContent.scrollHeight;
            const windowHeight = window.innerHeight;
            const scrollY = window.scrollY;

            // Calculate progress based on how much of the main content has been scrolled past
            let progress = 0;
            if (scrollY > contentTop) {
                 // How far into the content are we, starting from 0 when top of content hits top of viewport
                const scrolledPastContentTop = scrollY - contentTop;
                // Total scrollable range of the content itself
                const scrollableRange = contentHeight - windowHeight;

                if (scrollableRange <=0) { // content is shorter than viewport
                    progress = 100;
                } else {
                    progress = (scrolledPastContentTop / scrollableRange) * 100;
                }
            }

            progress = Math.min(Math.max(progress, 0), 100); // Clamp between 0 and 100
            progressBar.style.width = progress + '%';
        });
    }
});
