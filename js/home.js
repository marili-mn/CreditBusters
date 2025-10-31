document.addEventListener('DOMContentLoaded', () => {
    const sectionHome = document.getElementById('sectionHome');
    const body = document.body;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                body.style.backgroundColor = 'transparent';
            } else {
                const currentTheme = localStorage.getItem('theme') || 'light';
                if (currentTheme === 'dark') {
                    body.style.backgroundColor = '#1a202c'; // var(--bg-color-dark)
                } else {
                    body.style.backgroundColor = '#F8F9FA'; // var(--bg-color-light)
                }
            }
        });
    }, { threshold: 0.1 });

    if (sectionHome) {
        observer.observe(sectionHome);
    }
});
