document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle');

    const applyTheme = (theme) => {
        document.body.className = theme === 'dark' ? 'dark-theme' : '';
        if (themeToggleButton) {
            const icon = themeToggleButton.querySelector('i');
            if (icon) {
                // Handle icon-based toggles (like in index.html)
                icon.classList.toggle('fa-sun', theme === 'dark');
                icon.classList.toggle('fa-moon', theme === 'light');
            } else {
                // Handle text-based toggles
                themeToggleButton.textContent = theme === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
            }
        }
    };

    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            const newTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }
});
