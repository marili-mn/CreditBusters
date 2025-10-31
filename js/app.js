document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const users = DB.getUsers();
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                // Guardar sesión del usuario
                sessionStorage.setItem('userSession', JSON.stringify({ 
                    email: user.email, 
                    name: user.name, 
                    role: user.role 
                }));

                // Redirigir según el rol
                if (user.role === 'admin') {
                    window.location.href = 'dashboard-admin.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
            } else {
                // Mostrar mensaje de error
                const messageContainer = document.getElementById('message-container');
                messageContainer.innerHTML = '<p class="error">Credenciales incorrectas. Por favor, inténtalo de nuevo.</p>';
            }
        });
    }

    // --- Lógica para el botón de ver/ocultar contraseña ---
    const togglePasswordButton = document.querySelector('.btn-toggle-password');
    if (togglePasswordButton) {
        togglePasswordButton.addEventListener('click', function () {
            const passwordInput = this.previousElementSibling;
            const icon = this.querySelector('i');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }
});
