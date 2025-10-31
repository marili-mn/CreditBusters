document.addEventListener('DOMContentLoaded', function () {
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));
    const currentPage = window.location.pathname.split('/').pop();

    // Páginas que no requieren autenticación
    const publicPages = ['log-in.html', 'register-user.html', 'reset-password.html', 'password-user.html', 'index.html'];

    if (!userSession && !publicPages.includes(currentPage)) {
        // Si no hay sesión y la página no es pública, redirigir al login
        window.location.href = 'log-in.html';
        return;
    }

    if (userSession) {
        // Si hay sesión
        if (publicPages.includes(currentPage) && currentPage !== 'index.html') {
            // Si el usuario ya está logueado, redirigir al dashboard correspondiente
            if (userSession.role === 'admin') {
                window.location.href = 'dashboard-admin.html';
            } else {
                window.location.href = 'dashboard.html';
            }
            return;
        }

        // Proteger la página de administrador
        if (currentPage.includes('admin') && userSession.role !== 'admin') {
            // Si un usuario no-admin intenta acceder a una página de admin
            window.location.href = 'dashboard.html'; // Redirigir a su dashboard
            return;
        }

        // Configurar el botón de logout
        const logoutButton = document.getElementById('logout');
        if (logoutButton) {
            logoutButton.addEventListener('click', function () {
                sessionStorage.removeItem('userSession');
                window.location.href = 'log-in.html';
            });
        }
    }
});
