document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('signature-pad');
    const signaturePad = new SignaturePad(canvas);

    const clearButton = document.getElementById('clear-signature');
    const submitButton = document.getElementById('submit-signature');
    const creditSummary = document.getElementById('credit-summary');
    const messageContainer = document.getElementById('message-container');

    const userSession = JSON.parse(sessionStorage.getItem('userSession'));
    // Leer de localStorage, ya que formApp.js ahora guarda ahí
    const creditFormData = JSON.parse(localStorage.getItem('creditFormDataDraft'));

    if (!creditFormData) {
        // Si no hay datos del formulario, redirigir de vuelta
        window.location.href = 'form-data.html';
        return;
    }

    // Mostrar resumen del crédito
    creditSummary.innerHTML = `
        <h4>Resumen de la Solicitud</h4>
        <p><strong>Empresa:</strong> ${creditFormData.companyName}</p>
        <p><strong>Tipo de Crédito:</strong> ${creditFormData.creditType}</p>
        <p><strong>Monto Solicitado:</strong> $${parseFloat(creditFormData.amount).toLocaleString('es-MX')}</p>
    `;

    clearButton.addEventListener('click', function () {
        signaturePad.clear();
    });

    submitButton.addEventListener('click', function () {
        if (signaturePad.isEmpty()) {
            messageContainer.innerHTML = '<p class="error">Por favor, provea su firma.</p>';
            return;
        }

        const signatureDataUrl = signaturePad.toDataURL();

        // Corregir la estructura del objeto para que coincida con lo que esperan los dashboards
        const completeRequest = {
            fullData: creditFormData.fullData, // Usar el objeto fullData anidado directamente
            userEmail: userSession.email,
            userName: userSession.name,
            signature: signatureDataUrl,
            status: 'En Revisión' // Estado inicial
        };

        DB.saveCreditRequest(completeRequest);

        // Limpiar los datos temporales de localStorage después de la firma exitosa
        localStorage.removeItem('creditFormDataDraft');

        messageContainer.innerHTML = '<p class="success">¡Solicitud enviada con éxito!</p>';

        // Redirigir al dashboard después de un momento
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    });
});