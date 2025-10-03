document.addEventListener("DOMContentLoaded", () => {
    // Use localStorage as a simple client-side database
    const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];
    const saveUsers = (users) => localStorage.setItem('users', JSON.stringify(users));

    // Initialize with an empty array if it's the first time
    if (!localStorage.getItem('users')) {
        saveUsers([]);
    }

    // --- General Functions ---
    const showErrorMessage = (form, message, elementId = null) => {
        const errorElement = elementId ? document.getElementById(elementId) : form.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            errorElement.style.color = 'red';
        }
    };

    const hideErrorMessage = (form, elementId = null) => {
        const errorElement = elementId ? document.getElementById(elementId) : form.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    };


    // --- Page Specific Logic ---
    const path = window.location.pathname.split("/").pop();

    // --- Dashboard Page ---
    if (path === 'dashboard.html') {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!currentUser) {
            window.location.href = 'index.html'; // Redirect if not logged in
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

    // --- Login Page (index.html) ---
    if (path === 'index.html' || path === 'log-in.html' || path === '') {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = loginForm.email.value;
                const password = loginForm.password.value;
                const users = getUsers();
                const user = users.find(u => u.email === email && u.password === password);

                if (user) {
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                    window.location.href = 'dashboard.html';
                } else {
                    showErrorMessage(loginForm, 'Email o contraseña incorrectos.');
                }
            });
        }
    }

    // --- Registration Page ---
    if (path === 'register-user.html') {
        const registerForm = document.getElementById('registerForm');
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        const passwordInput = document.getElementById('password');
        const passwordStrength = document.getElementById('password-strength');

        emailInput.addEventListener('input', () => {
            const email = emailInput.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.length > 0 && !emailRegex.test(email)) {
                emailError.textContent = 'Debe ser un email válido.';
                emailError.style.color = 'orange';
                emailError.style.display = 'block';
            } else {
                hideErrorMessage(null, 'email-error');
            }
        });

        emailInput.addEventListener('blur', () => {
            const email = emailInput.value;
            const users = getUsers();
            if (users.find(u => u.email === email)) {
                emailError.textContent = 'El email ya está registrado.';
                emailError.style.color = 'red';
                emailError.style.display = 'block';
            } else if (email.length > 0) {
                 hideErrorMessage(null, 'email-error');
            }
        });

        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
            if (regex.test(password)) {
                passwordStrength.textContent = 'Segura';
                passwordStrength.style.color = 'green';
            } else {
                passwordStrength.textContent = 'Debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número.';
                passwordStrength.style.color = 'orange';
            }
        });

        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = registerForm.nombre.value;
            const apellido = registerForm.apellido.value;
            const email = registerForm.email.value;
            const password = registerForm.password.value;
            const users = getUsers();

            // Final validation before submit
            if (users.find(u => u.email === email)) {
                showErrorMessage(registerForm, 'El email ya está registrado.', 'email-error');
                return;
            }
            const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
            if (!passwordRegex.test(password)) {
                 showErrorMessage(registerForm, 'La contraseña no es segura.', 'password-strength');
                 return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(email)){
                showErrorMessage(registerForm, 'Debe ser un email válido.', 'email-error');
                return;
            }

            const newUser = { nombre, apellido, email, password };
            users.push(newUser);
            saveUsers(users);

            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            window.location.href = 'index.html';
        });
    }

    // --- Password Recovery Page ---
    if (path === 'password-user.html') {
        const recuperarForm = document.getElementById("recuperarForm");
        if (recuperarForm) {
            recuperarForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const email = recuperarForm.email.value;
                const users = getUsers();
                const userExists = users.find(u => u.email === email);
                const container = document.getElementById("formulario-container");

                // Even if user doesn't exist, we show a generic message for security
                container.innerHTML = `
                    <h2>Se ha enviado un correo de recuperación a tu email.</h2>
                    <p style="color:white; font-size:16px; margin-top:20px; text-align: center;">
                      (Esto es una simulación. Si el email '${email}' existe, se habría enviado un correo. Haz clic para recuperar la cuenta.)
                    </p>
                    <a href="recover-account.html?email=${encodeURIComponent(email)}">
                      <button style="padding:10px 20px; border:none; border-radius:20px; background:#ff5722; color:white; font-weight:bold; cursor:pointer;">
                        Simular Clic en Correo
                      </button>
                    </a>`;
            });
        }
    }

    // --- Recover Account Page (Reset Password) ---
    if (path === 'recover-account.html') {
        const passwordForm = document.getElementById('passwordForm');
        const emailInput = passwordForm.querySelector('input[name="email"]');
        const urlParams = new URLSearchParams(window.location.search);
        const emailFromUrl = urlParams.get('email');

        if (emailFromUrl) {
            emailInput.value = emailFromUrl;
            emailInput.readOnly = true; // Prevent user from changing it
        }

        if (passwordForm) {
            const newPasswordInput = document.getElementById('newPassword');
            const confirmPasswordInput = document.getElementById('confirmPassword');
            const messageDisplay = document.getElementById('message');

            passwordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                messageDisplay.textContent = '';
                const email = emailInput.value;
                const newPassword = newPasswordInput.value;
                const confirmPassword = confirmPasswordInput.value;

                if (!newPassword || !confirmPassword) return;

                if (newPassword !== confirmPassword) {
                    messageDisplay.textContent = 'ERROR: Las contraseñas NO coinciden.';
                    messageDisplay.className = 'message error';
                    confirmPasswordInput.value = '';
                    confirmPasswordInput.focus();
                    return;
                }
                
                const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
                if (!passwordRegex.test(newPassword)) {
                    messageDisplay.textContent = 'La contraseña no es segura.';
                    messageDisplay.className = 'message error';
                    return;
                }

                let users = getUsers();
                const userIndex = users.findIndex(u => u.email === email);

                if (userIndex !== -1) {
                    users[userIndex].password = newPassword;
                    saveUsers(users);
                    messageDisplay.textContent = '¡Contraseña cambiada con éxito!';
                    messageDisplay.className = 'message success';
                } else {
                    messageDisplay.textContent = 'Error: El usuario no fue encontrado.';
                    messageDisplay.className = 'message error';
                }

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            });
        }
    }
});