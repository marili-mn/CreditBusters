document.addEventListener('DOMContentLoaded', function () {
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));
    const welcomeMessage = document.getElementById('welcome-message');
    const creditList = document.querySelector('.credit-list');

    // Modal elements
    const modal = document.getElementById('details-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.getElementById('close-modal');

    if (userSession) {
        welcomeMessage.textContent = `Bienvenido, ${userSession.name}`;
        loadCreditRequests(userSession.email);
    } else {
        window.location.href = 'log-in.html';
        return;
    }

    function loadCreditRequests(userEmail) {
        const allRequests = DB.getCreditRequests();
        const userRequests = allRequests.filter(req => req.userEmail === userEmail);

        creditList.innerHTML = ''; // Limpiar la lista antes de cargar

        if (userRequests.length === 0) {
            creditList.innerHTML = '<p>No tienes solicitudes de crédito todavía. ¡Anímate a solicitar uno!</p>';
            return;
        }

        userRequests.forEach(request => {
            const card = document.createElement('article');
            card.className = 'credit-card';

            const statusClass = getStatusClass(request.status);

            card.innerHTML = `
                <div class="credit-info">
                    <h3>${request.fullData.destino_credito}</h3>
                    <p>Monto: $${parseFloat(request.fullData.monto_solicitado).toLocaleString('es-MX')}</p>
                    <p>Fecha: ${new Date(request.timestamp).toLocaleDateString('es-ES')}</p>
                </div>
                <div class="credit-status">
                    <span class="status-badge ${statusClass}">${request.status}</span>
                    <button class="btn btn-secondary view-details-btn" data-id="${request.id}">Ver Detalles</button>
                </div>
            `;
            creditList.appendChild(card);
        });
    }

    // Event listener for view details
    creditList.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-details-btn')) {
            const requestId = e.target.dataset.id;
            showDetailsModal(requestId);
        }
    });

    function showDetailsModal(requestId) {
        const request = DB.getRequestById(requestId);
        if (!request) return;

        const data = request.fullData;
        modalBody.innerHTML = `
            <h3>Datos de la Empresa</h3>
            <p><strong>Razón Social:</strong> ${data.razon_social}</p>
            <p><strong>C.U.I.T.:</strong> ${data.cuit}</p>
            
            <h3>Detalles del Crédito</h3>
            <p><strong>Monto Solicitado:</strong> $${parseFloat(data.monto_solicitado).toLocaleString('es-MX')}</p>
            <p><strong>Plazo:</strong> ${data.plazo} meses</p>
            <p><strong>Destino:</strong> ${data.destino_credito}</p>

            <h3>Firma Digital</h3>
            <div style="background-color: white; border: 1px solid #ccc; border-radius: 4px; padding: 10px; margin-top: 10px; display: inline-block;">
                <img src="${request.signature}" alt="Firma Digital" style="width: 100%; max-width: 300px;">
            </div>
        `;
        modal.style.display = 'flex';
    }

    // Close modal logic
    closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    function getStatusClass(status) {
        switch (status) {
            case 'Aprobado': return 'status-approved';
            case 'En Revisión': return 'status-review';
            case 'Rechazado': return 'status-rejected';
            default: return 'status-pending';
        }
    }
});
