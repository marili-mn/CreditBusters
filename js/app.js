class App {
    constructor() {
        this.api = new Api();
        this._route();
        this._setupCommonListeners();
    }

    _route() {
        const path = window.location.pathname.split("/").pop();
        this._displayFlashMessage(); // Display flash on every page load

        if (path === 'dashboard.html') {
            this._setupDashboardPage();
        } else if (['log-in.html', 'register-user.html', 'password-user.html', 'reset-password.html'].includes(path)) {
            this._setupAuthPage();
        } else {
            this._setupHomePage(); // index.html and other pages are public
        }
    }

    _setupHomePage() {
        // Lógica para la página de inicio pública (si es necesario)
        // Ya no se requiere autenticación aquí
    }

    async _setupDashboardPage() {
        if (!this.api.token) {
            window.location.href = 'log-in.html';
            return;
        }

        try {
            // Decode the token to get the user's email
            const tokenPayload = JSON.parse(atob(this.api.token.split('.')[1]));
            const userEmail = tokenPayload.email;

            // We need the user ID to fetch user data. The API does not provide it in the token.
            // For now, we will just display the email from the token.
            const welcomeEl = document.getElementById('welcome-message');
            if (welcomeEl) {
                welcomeEl.textContent = `Hola, ${userEmail}`;
            }

            const userInfoEl = document.getElementById('user-info');
            if (userInfoEl) {
                const logoutBtn = document.createElement('button');
                logoutBtn.textContent = 'Cerrar Sesión';
                logoutBtn.className = 'btn btn-secondary';
                logoutBtn.onclick = () => {
                    this.api.logout();
                    this._setFlashMessage('Has cerrado sesión.', 'success');
                    window.location.href = 'log-in.html';
                };
                userInfoEl.appendChild(logoutBtn);
            }
        } catch (error) {
            console.error('Error setting up dashboard:', error);
            this.api.logout();
            window.location.href = 'log-in.html';
        }
    }

    _setupAuthPage() {
        const form = document.querySelector('.auth-form');
        if (!form) return;

        if (localStorage.getItem('loggedInUser')) {
            window.location.href = 'dashboard.html';
            return;
        }

        switch (form.id) {
            case 'registerForm': this._setupRegistrationPage(); break;
            case 'loginForm': this._setupLoginPage(); break;
            case 'recoveryForm': this._setupRecoveryPage(); break;
            case 'resetPasswordForm': this._setupResetPasswordPage(); break;
        }
    }

    _setupCommonListeners() {
        document.querySelectorAll('.btn-toggle-password').forEach(btn => {
            btn.addEventListener('click', () => {
                const input = btn.previousElementSibling;
                const icon = btn.querySelector('i');
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.replace('fa-eye', 'fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.replace('fa-eye-slash', 'fa-eye');
                }
            });
        });
    }

    _displayMessage(text, type) {
        const container = document.getElementById('message-container');
        container.innerHTML = `<div class="message ${type}">${text}</div>`;
    }

    _setFlashMessage(message, type) {
        sessionStorage.setItem('flashMessage', JSON.stringify({ message, type }));
    }

    _displayFlashMessage() {
        const flash = sessionStorage.getItem('flashMessage');
        if (flash) {
            const { message, type } = JSON.parse(flash);
            const container = document.getElementById('flash-message-container');
            if(container) {
                container.innerHTML = `<div class="flash-message ${type}">${message}</div>`;
                sessionStorage.removeItem('flashMessage');
            }
        }
    }

    _setLoading(form, isLoading) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const spinner = submitBtn.querySelector('.spinner');
        if (!submitBtn) return;
        submitBtn.disabled = isLoading;
        if (spinner) spinner.style.display = isLoading ? 'inline-block' : 'none';
        if (btnText) btnText.style.display = isLoading ? 'none' : 'inline-block';
    }

    _setupRegistrationPage() {
        const form = document.getElementById('registerForm');
        const state = { name: false, lastname: false, email: false, passwordStrength: false, passwordMatch: false };

        const checkFormState = () => {
            form.querySelector('button[type="submit"]').disabled = !Object.values(state).every(Boolean);
        };

        form.name.addEventListener('input', () => { state.name = form.name.value.trim() !== ''; checkFormState(); });
        form.lastname.addEventListener('input', () => { state.lastname = form.lastname.value.trim() !== ''; checkFormState(); });

        form.email.addEventListener('input', () => {
            const feedbackEl = form.email.nextElementSibling;
            if (!/.+@.+\..+/.test(form.email.value)) {
                feedbackEl.textContent = 'Debe ser un email válido.'; state.email = false;
            } else {
                feedbackEl.textContent = 'Email válido.'; state.email = true;
            }
            feedbackEl.className = `form-feedback ${state.email ? 'valid' : 'invalid'}`;
            checkFormState();
        });

        const strengthEl = document.getElementById('password-strength-feedback');
        const requirements = {
            length: { el: strengthEl.querySelector('[data-requirement="length"]'), regex: /.{8,}/ },
            uppercase: { el: strengthEl.querySelector('[data-requirement="uppercase"]'), regex: /[A-Z]/ },
            lowercase: { el: strengthEl.querySelector('[data-requirement="lowercase"]'), regex: /[a-z]/ },
            number: { el: strengthEl.querySelector('[data-requirement="number"]'), regex: /[0-9]/ },
            special: { el: strengthEl.querySelector('[data-requirement="special"]'), regex: /[!@#$%^&*(),.?":{}|<>]/ }
        };

        form.password.addEventListener('input', () => {
            let allReqsMet = true;
            for (const key in requirements) {
                const req = requirements[key];
                const met = req.regex.test(form.password.value);
                if (req.el) { // Defensive check
                    req.el.classList.toggle('valid', met);
                }
                if (!met) allReqsMet = false;
            }
            state.passwordStrength = allReqsMet;
            validatePasswordsMatch();
        });

        const validatePasswordsMatch = () => {
            const matchFeedbackEl = form.confirmPassword.parentElement.nextElementSibling;
            state.passwordMatch = form.password.value === form.confirmPassword.value && form.confirmPassword.value.length > 0;
            matchFeedbackEl.textContent = state.passwordMatch ? 'Las contraseñas coinciden.' : (form.confirmPassword.value.length > 0 ? 'No coinciden.' : '');
            matchFeedbackEl.className = `form-feedback ${state.passwordMatch ? 'valid' : 'invalid'}`;
            checkFormState();
        };

        form.confirmPassword.addEventListener('input', validatePasswordsMatch);

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            this._setLoading(form, true);
            try {
                const userData = {
                    first_name: form.name.value,
                    last_name: form.lastname.value,
                    email: form.email.value,
                    password: form.password.value,
                };
                await this.api.register(userData);
                this._setFlashMessage('¡Registro Exitoso! Ahora puedes iniciar sesión.', 'success');
                window.location.href = 'log-in.html';
            } catch (error) {
                this._displayMessage(error.message, 'error');
                this._setLoading(form, false);
            }
        });
    }

    _setupLoginPage() {
        const form = document.getElementById('loginForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            this._setLoading(form, true);

            try {
                const email = form.email.value;
                const password = form.password.value;
                const data = await this.api.login(email, password);

                const tokenPayload = JSON.parse(atob(data.access_token.split('.')[1]));
                const userRole = tokenPayload.role;

                localStorage.setItem('userRole', userRole);

                if (userRole === 'admin' || userRole === 'superadmin') {
                    window.location.href = 'dashboard-admin.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
                this._setFlashMessage(`¡Bienvenido de nuevo!`, 'success');
            } catch (error) {
                this._displayMessage(error.message, 'error');
                this._setLoading(form, false);
            }
        });
    }

    _setupRecoveryPage() {
        const form = document.getElementById('recoveryForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            this._setLoading(form, true);

            try {
                const email = form.email.value;
                await this.api.requestPasswordReset(email);
                sessionStorage.setItem('recoveryEmail', email);
                this._setFlashMessage('Se ha enviado un enlace para restablecer tu contraseña.', 'success');
                window.location.href = 'reset-password.html';
            } catch (error) {
                this._displayMessage(error.message, 'error');
                this._setLoading(form, false);
            }
        });
    }

    _setupResetPasswordPage() {
        const form = document.getElementById('resetPasswordForm');
        const recoveryEmail = sessionStorage.getItem('recoveryEmail');

        if (!recoveryEmail) {
            window.location.href = 'password-user.html';
            return;
        }

        const state = { passwordStrength: false, passwordMatch: false };
        const checkFormState = () => {
            form.querySelector('button[type="submit"]').disabled = !Object.values(state).every(Boolean);
        };

        const strengthEl = document.getElementById('password-strength-feedback');
        const requirements = {
            length: { el: strengthEl.querySelector('[data-requirement="length"]'), regex: /.{8,}/ },
            uppercase: { el: strengthEl.querySelector('[data-requirement="uppercase"]'), regex: /[A-Z]/ },
            lowercase: { el: strengthEl.querySelector('[data-requirement="lowercase"]'), regex: /[a-z]/ },
            number: { el: strengthEl.querySelector('[data-requirement="number"]'), regex: /[0-9]/ },
            special: { el: strengthEl.querySelector('[data-requirement="special"]'), regex: /[!@#$%^&*(),.?":{}|<>]/ }
        };

        form.password.addEventListener('input', () => {
            let allReqsMet = true;
            for (const key in requirements) {
                const req = requirements[key];
                const met = req.regex.test(form.password.value);
                if (req.el) { // Defensive check
                    req.el.classList.toggle('valid', met);
                }
                if (!met) allReqsMet = false;
            }
            state.passwordStrength = allReqsMet;
            validatePasswordsMatch();
        });

        const validatePasswordsMatch = () => {
            const matchFeedbackEl = form.confirmPassword.parentElement.nextElementSibling;
            state.passwordMatch = form.password.value === form.confirmPassword.value && form.confirmPassword.value.length > 0;
            matchFeedbackEl.textContent = state.passwordMatch ? 'Las contraseñas coinciden.' : (form.confirmPassword.value.length > 0 ? 'No coinciden.' : '');
            matchFeedbackEl.className = `form-feedback ${state.passwordMatch ? 'valid' : 'invalid'}`;
            checkFormState();
        };

        form.confirmPassword.addEventListener('input', validatePasswordsMatch);
        checkFormState();

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!state.passwordStrength || !state.passwordMatch) return;

            this._setLoading(form, true);

            try {
                const resetCode = form.resetCode.value;
                const newPassword = form.password.value;

                await this.api.verifyResetCode(recoveryEmail, resetCode);
                await this.api.resetPassword(recoveryEmail, resetCode, newPassword);

                sessionStorage.removeItem('recoveryEmail');
                this._setFlashMessage('Tu contraseña ha sido actualizada. Ahora puedes iniciar sesión.', 'success');
                window.location.href = 'log-in.html';
            } catch (error) {
                this._displayMessage(error.message, 'error');
                this._setLoading(form, false);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new App());