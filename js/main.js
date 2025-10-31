document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburgerMenu');
    const navMenu = document.getElementById('nav-menu');
    const langToggle = document.getElementById('lang-toggle');

    // Hamburger Menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Language Toggle
    const setLanguage = (lang) => {
        document.querySelectorAll('[data-key]').forEach(elem => {
            const key = elem.getAttribute('data-key');
            if (translations[lang] && translations[lang][key]) {
                elem.innerHTML = translations[lang][key];
            }
        });
        // Handle placeholders
        document.querySelectorAll('[data-key-placeholder]').forEach(elem => {
            const key = elem.getAttribute('data-key-placeholder');
            if (translations[lang] && translations[lang][key]) {
                elem.placeholder = translations[lang][key];
            }
        });
        document.documentElement.lang = lang;
        if (langToggle) {
            langToggle.textContent = lang === 'es' ? 'EN' : 'ES';
        }
    };

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const currentLang = document.documentElement.lang || 'es';
            const newLang = currentLang === 'es' ? 'en' : 'es';
            localStorage.setItem('language', newLang);
            setLanguage(newLang);
        });
    }

    // Load initial language
    const savedLang = localStorage.getItem('language') || 'es';
    setLanguage(savedLang);

    // Scroll Reveal Logic
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 100) { // 100px buffer
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
});