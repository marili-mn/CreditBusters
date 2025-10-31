document.addEventListener('DOMContentLoaded', function () {
    const recoveryForm = document.getElementById('recoveryForm');

    if (recoveryForm) {
        recoveryForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const formWrapper = document.querySelector('.auth-form-wrapper'); // Target the wrapper
            const api = new Api();

            try {
                await api.requestPasswordReset(email);
                
                // Replace the form with the success message and button
                formWrapper.innerHTML = `
                    <div class="auth-form">
                        <div id="message-container">
                            <p class="success">Se han enviado las instrucciones para recuperar tu contraseña a tu correo electrónico.</p>
                        </div>
                        <p>Por favor, revisa tu bandeja de entrada e introduce el código de verificación en la siguiente pantalla.</p>
                        <button id="goToReset" class="btn btn-primary">Introducir Código</button>
                    </div>
                `;

                // Add event listener to the new button
                document.getElementById('goToReset').addEventListener('click', () => {
                    window.location.href = 'reset-password.html';
                });

            } catch (error) {
                const messageContainer = document.getElementById('message-container');
                messageContainer.innerHTML = `<p class="error">${error.message}</p>`;
            }
        });
    }
});