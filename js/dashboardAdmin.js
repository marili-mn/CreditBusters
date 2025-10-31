document.addEventListener('DOMContentLoaded', function () {
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));
    const welcomeMessage = document.getElementById('welcomeMessage');
    const requestList = document.getElementById('request-list');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');

    // Modal elements
    const modal = document.getElementById('details-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.getElementById('close-modal');

    if (userSession) {
        welcomeMessage.textContent = `Bienvenido, ${userSession.name}`;
        loadAllRequests();
    } else {
        window.location.href = 'log-in.html';
        return;
    }

    searchInput.addEventListener('input', loadAllRequests);
    statusFilter.addEventListener('change', loadAllRequests);

    function loadAllRequests() {
        const allRequests = DB.getCreditRequests();
        const searchTerm = searchInput.value.toLowerCase();
        const status = statusFilter.value;

        const filteredRequests = allRequests.filter(req => {
            const companyName = req.fullData.razon_social || '';
            const creditType = req.fullData.destino_credito || '';
            const matchesSearch = companyName.toLowerCase().includes(searchTerm) || 
                                  creditType.toLowerCase().includes(searchTerm);
            const matchesStatus = status === 'all' || req.status === status;
            return matchesSearch && matchesStatus;
        });

        renderRequests(filteredRequests);
    }

    function renderRequests(requests) {
        requestList.innerHTML = '';
        if (requests.length === 0) {
            requestList.innerHTML = '<p>No se encontraron solicitudes que coincidan con los filtros.</p>';
            return;
        }

        requests.forEach(request => {
            const card = document.createElement('div');
            card.className = 'request-card';
            const statusClass = getStatusClass(request.status);

            card.innerHTML = `
                <div class="request-info">
                    <h3>${request.fullData.destino_credito}</h3>
                    <p><strong>Empresa:</strong> ${request.fullData.razon_social}</p>
                    <p><strong>Monto:</strong> $${parseFloat(request.fullData.monto_solicitado).toLocaleString('es-MX')}</p>
                    <p><strong>Fecha:</strong> ${new Date(request.timestamp).toLocaleString('es-ES')}</p>
                </div>
                <div class="request-controls">
                    <button class="btn btn-secondary view-details-btn" data-id="${request.id}">Ver Detalles</button>
                    <select data-id="${request.id}" class="status-select">
                        <option value="En Revisión" ${request.status === 'En Revisión' ? 'selected' : ''}>En Revisión</option>
                        <option value="Aprobado" ${request.status === 'Aprobado' ? 'selected' : ''}>Aprobado</option>
                        <option value="Rechazado" ${request.status === 'Rechazado' ? 'selected' : ''}>Rechazado</option>
                    </select>
                </div>
                <div class="request-status-bar">
                    <span class="status-badge ${statusClass}">${request.status}</span>
                </div>
            `;
            requestList.appendChild(card);
        });
    }

    // Event listener for status change and view details
    requestList.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-details-btn')) {
            const requestId = e.target.dataset.id;
            showDetailsModal(requestId);
        }
    });

    requestList.addEventListener('change', function(e) {
        if (e.target.classList.contains('status-select')) {
            const requestId = e.target.dataset.id;
            const newStatus = e.target.value;
            DB.updateCreditRequestStatus(requestId, newStatus);
            loadAllRequests(); // Recargar la lista para reflejar el cambio
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
            <p><strong>Forma Jurídica:</strong> ${data.forma_juridica}</p>
            <p><strong>Actividad Principal:</strong> ${data.clae}</p>
            
            <h3>Contacto</h3>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Teléfono:</strong> ${data.telefono}</p>

            <h3>Domicilio Fiscal</h3>
            <p><strong>Dirección:</strong> ${data.calle} ${data.piso_dpto}</p>
            <p><strong>Ciudad:</strong> ${data.ciudad}, ${data.provincia}, ${data.pais}</p>
            <p><strong>Código Postal:</strong> ${data.cp}</p>

            <h3>Detalles del Crédito</h3>
            <p><strong>Monto Solicitado:</strong> $${parseFloat(data.monto_solicitado).toLocaleString('es-MX')}</p>
            <p><strong>Plazo:</strong> ${data.plazo} meses</p>
            <p><strong>Destino:</strong> ${data.destino_credito}</p>
            <p><strong>Garantías:</strong> ${data.garantias || 'N/A'}</p>

            <h3>Resumen Económico</h3>
            <p><strong>Cierre de Ejercicio:</strong> ${data.cierre_ejercicio}</p>
            <p><strong>Ventas Anuales:</strong> $${parseFloat(data.ventas_anuales).toLocaleString('es-MX')}</p>
            <p><strong>Activo Total:</strong> $${parseFloat(data.activo_total).toLocaleString('es-MX')}</p>
            <p><strong>Nro. de Empleados:</strong> ${data.empleados}</p>

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