document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;

    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const submitButton = document.getElementById('submit-btn');
    
    const requirements = {
        length: document.querySelector('[data-requirement="length"]'),
        uppercase: document.querySelector('[data-requirement="uppercase"]'),
        lowercase: document.querySelector('[data-requirement="lowercase"]'),
        number: document.querySelector('[data-requirement="number"]'),
        special: document.querySelector('[data-requirement="special"]')
    };

    const confirmPasswordFeedback = document.querySelector('#confirmPassword').parentElement.nextElementSibling;

    const validators = {
        length: val => val.length >= 8,
        uppercase: val => /[A-Z]/.test(val),
        lowercase: val => /[a-z]/.test(val),
        number: val => /[0-9]/.test(val),
        special: val => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(val)
    };

    const validatePasswordStrength = () => {
        let allValid = true;
        for (const requirement in validators) {
            const isValid = validators[requirement](passwordInput.value);
            if (isValid) {
                requirements[requirement].classList.add('valid');
            } else {
                requirements[requirement].classList.remove('valid');
                allValid = false;
            }
        }
        return allValid;
    };

    const validatePasswordMatch = () => {
        const passwordsMatch = passwordInput.value === confirmPasswordInput.value && confirmPasswordInput.value.length > 0;
        if (passwordsMatch) {
            confirmPasswordFeedback.textContent = 'Las contraseñas coinciden.';
            confirmPasswordFeedback.className = 'form-feedback valid';
        } else if (confirmPasswordInput.value.length > 0) {
            confirmPasswordFeedback.textContent = 'Las contraseñas no coinciden.';
            confirmPasswordFeedback.className = 'form-feedback invalid';
        } else {
            confirmPasswordFeedback.textContent = '';
            confirmPasswordFeedback.className = 'form-feedback';
        }
        return passwordsMatch;
    };

    const masterValidator = () => {
        const strengthValid = validatePasswordStrength();
        const matchValid = validatePasswordMatch();

        if (strengthValid && matchValid) {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    };

    passwordInput.addEventListener('keyup', masterValidator);
    confirmPasswordInput.addEventListener('keyup', masterValidator);

    // --- Lógica para el botón de ver/ocultar contraseña ---
    const togglePasswordButtons = document.querySelectorAll('.btn-toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function () {
            const passwordField = this.closest('.input-group').querySelector('input');
            const icon = this.querySelector('i');
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordField.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        masterValidator(); // Run a final check

        if (submitButton.disabled) {
            return; // Exit if form is not valid
        }

        try {
            const name = document.getElementById('name').value;
            const lastname = document.getElementById('lastname').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const messageContainer = document.getElementById('message-container');

            const users = DB.getUsers();
            const userExists = users.find(u => u.email === email);

            if (userExists) {
                messageContainer.innerHTML = `<p class="error">El usuario ya existe.</p>`;
                return;
            }

            const newUser = {
                email: email,
                password: password,
                role: 'user',
                name: `${name} ${lastname}`
            };
            users.push(newUser);
            DB.setUsers(users);

            messageContainer.innerHTML = `<p class="success">¡Registro exitoso! Redirigiendo al login...</p>`;
            
            setTimeout(() => {
                window.location.href = 'log-in.html';
            }, 2000);

        } catch (error) {
            const messageContainer = document.getElementById('message-container');
            messageContainer.innerHTML = `<p class="error">Ocurrió un error durante el registro. Por favor, inténtelo de nuevo.</p>`;
            console.error("Error en el registro:", error);
        }
    });
});