document.addEventListener("DOMContentLoaded", () => {
    // Initialize fake DB
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }

    const handleAuthPages = () => {
        const path = window.location.pathname.split("/").pop();

        if (path === 'dashboard.html') {
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            if (!currentUser) {
                window.location.href = 'index.html';
                return;
            }
            const welcomeMessage = document.getElementById('welcome-message');
            if (welcomeMessage) {
                welcomeMessage.textContent = `Bienvenido, ${currentUser.nombre}!`;
            }

            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    sessionStorage.removeItem('currentUser');
                    window.location.href = 'index.html';
                });
            }
        }
    };

    const showErrorMessage = (form, message) => {
        let errorDiv = form.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            form.prepend(errorDiv);
        }
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        errorDiv.style.color = 'red';
    };

    // --- LOGIN ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginForm.email.value;
            const password = loginForm.password.value;
            const users = JSON.parse(localStorage.getItem('users'));

            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = 'dashboard.html';
            } else {
                showErrorMessage(loginForm, 'Email o contraseña incorrectos.');
            }
        });
    }

    // --- REGISTRATION ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        const passwordInput = document.getElementById('password');
        const passwordStrength = document.getElementById('password-strength');

        emailInput.addEventListener('input', () => {
            const email = emailInput.value;
            const emailRegex = /^[^S@]+@[^S@]+\.[^S@]+$/;
            if (email.length > 0 && !emailRegex.test(email)) {
                emailError.textContent = 'Debe ser un email válido.';
                emailError.style.color = 'orange';
                emailError.style.display = 'block';
            } else {
                emailError.style.display = 'none';
            }
        });
        
        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            let strength = '';
            const regex = new RegExp("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$");
            if(regex.test(password)) {
                strength = 'Segura';
                passwordStrength.style.color = 'green';
            } else {
                strength = 'Debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número.';
                passwordStrength.style.color = 'orange';
            }
            passwordStrength.textContent = strength;
        });

        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = registerForm.nombre.value;
            const apellido = registerForm.apellido.value;
            const email = registerForm.email.value;
            const password = registerForm.password.value;
            
            const users = JSON.parse(localStorage.getItem('users'));

            if (users.find(u => u.email === email)) {
                emailError.textContent = 'El email ya está registrado.';
                emailError.style.color = 'red';
                emailError.style.display = 'block';
                return;
            }

            const newUser = { nombre, apellido, email, password };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            window.location.href = 'index.html';
        });
    }

    // --- PASSWORD RECOVERY (Visual Mock) ---
    const recuperarForm = document.getElementById("recuperarForm");
    if (recuperarForm) {
        recuperarForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const container = document.getElementById("formulario-container");
            container.innerHTML = "\n                <h2>Se ha enviado un correo de recuperación a tu email.</h2>\n                <p style=\"color:white; font-size:16px; margin-top:20px; text-align: center;\">
                (Esto es una demo, no se envió ningún correo)
                </p>\n                <a href=\"index.html\" style=\"text-align: center; display: block; margin-top: 20px;\">
                    <button style=\"padding:10px 20px; border:none; border-radius:20px; background:#ff5722; color:white; font-weight:bold; cursor:pointer;\">
                    Volver al inicio
                    </button>
                </a>
            ";
        });
    }
    
    // --- PASSWORD RESET (Visual Mock) ---
    const passwordForm = document.getElementById('passwordForm');
      if(passwordForm) {
        const newPasswordInput = document.getElementById('newPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const messageDisplay = document.getElementById('message');

        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            messageDisplay.textContent = '';
            messageDisplay.className = 'message';
            const newPassword = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            if (!newPassword || !confirmPassword) return;

            if (newPassword === confirmPassword) {
                messageDisplay.textContent = '¡Contraseña cambiada con éxito! (Demo)';
                messageDisplay.classList.add('success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                messageDisplay.textContent = 'ERROR: Las contraseñas NO coinciden.';
                messageDisplay.classList.add('error');
                confirmPasswordInput.value = '';
                confirmPasswordInput.focus();
            }
        });
    }

    // Initial page setup
    handleAuthPages();
});
