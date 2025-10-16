document.addEventListener('DOMContentLoaded', async () => {
    const api = new Api();

    const newCreditButton = document.querySelector('.btn-primary');
    newCreditButton.addEventListener('click', () => {
        window.location.href = 'form-data.html';
    });

    const creditList = document.querySelector('.credit-list');

    try {
        const credits = await api.getCredits();
        creditList.innerHTML = ''; // Clear existing content

        if (credits.length === 0) {
            creditList.innerHTML = '<p>No tienes solicitudes de crédito.</p>';
            return;
        }

        credits.forEach(credit => {
            const creditCard = document.createElement('article');
            creditCard.className = 'credit-card';

            let statusBadge;
            switch (credit.status) {
                case 'approved':
                    statusBadge = '<span class="status-badge status-approved">Aprobado</span>';
                    break;
                case 'pending':
                    statusBadge = '<span class="status-badge status-review">En Revisión</span>';
                    break;
                case 'rejected':
                    statusBadge = '<span class="status-badge status-rejected">Rechazado</span>';
                    break;
                default:
                    statusBadge = '<span class="status-badge">Desconocido</span>';
            }

            creditCard.innerHTML = `
                <div class="credit-info">
                    <h3>Crédito por ${credit.amount}</h3>
                    <p>Monto: $${credit.amount.toLocaleString('es-AR')}</p>
                    <p>Fecha: ${new Date().toLocaleDateString('es-AR')}</p> 
                </div>
                <div class="credit-status">
                    ${statusBadge}
                    <a href="#" class="btn btn-secondary">Ver Detalles</a>
                </div>
            `;
            creditList.appendChild(creditCard);
        });
    } catch (error) {
        console.error('Error fetching credits:', error);
        creditList.innerHTML = '<p>Error al cargar las solicitudes de crédito.</p>';
    }
});
