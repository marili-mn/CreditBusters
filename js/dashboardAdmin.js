let companieActive = null;  


const api = new Api();

//FUNCIONES DE UTILIDAD PARA LOCALSTORAGE

async function getSolicitudes() {
    try {
        return await api.getCredits();
    } catch (error) {
        console.error('Error fetching credits:', error);
        return [];
    }
}

// 3. LÓGICA DE NAVEGACIÓN POR EMPRESA

function updateActiveItem(clickedItem) {
    const companyList = document.getElementById('companyList');
    if (!companyList) return;

    companyList.querySelectorAll('.company-item').forEach(item => {
        item.classList.remove('active');
    });
    if (clickedItem) {
        clickedItem.classList.add('active');
    }
}

async function setuplistCompanies() {
    const companyList = document.getElementById('companyList'); 
    const allPymes = await api.getPymes();
    
    const companies = [...new Set(allPymes.map(pyme => pyme.name_company))].sort();
    
    companyList.innerHTML = ''; 

    if (companies.length === 0) {
        companyList.innerHTML = '<li class="company-item">No hay datos.</li>';
        return;
    }

    companies.forEach(empresa => {
        const item = document.createElement('li');
        item.className = 'company-item';
        item.textContent = empresa;
        item.dataset.empresa = empresa; 

        item.addEventListener('click', (event) => {
            companieActive = empresa;
            renderDashboard();
            updateActiveItem(event.currentTarget);
        });
        companyList.appendChild(item);
    });
}

function setupSearchFilter() {
    const searchInput = document.getElementById('searchCompany');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const companies = document.querySelectorAll('.company-item');

        companies.forEach(company => {
            const companyName = company.textContent.toLowerCase();
            if (companyName.includes(searchTerm)) {
                company.style.display = 'flex';
            } else {
                company.style.display = 'none';
            }
        });
    });
}

//FUNCIONES PRINCIPALES DEL DASHBOARD


async function renderDashboard() {
    const dashboardContainer = document.getElementById('dashboardContainer');
    const noDataMessage = document.getElementById('noDataMessage');
    const empresaActualNombre = document.getElementById('empresa-actual-nombre');
    
    const allCredits = await getSolicitudes(); 
    const allPymes = await api.getPymes();
    dashboardContainer.innerHTML = ''; 

    const pymesByName = allPymes.reduce((acc, pyme) => {
        acc[pyme.name_company] = pyme;
        return acc;
    }, {});

    const activePyme = pymesByName[companieActive];

    const solicitudesFiltradas = activePyme ? allCredits.filter(credit => credit.pyme_id === activePyme.id) : [];
    
    empresaActualNombre.textContent = companieActive || "Sin Empresa Seleccionada";

    if (!companieActive || solicitudesFiltradas.length === 0) {
        noDataMessage.textContent = companieActive ? 
            `No hay solicitudes para ${companieActive}.` :
            'Seleccione una empresa en el menú lateral.';
        noDataMessage.classList.remove('hidden');
        noDataMessage.classList.add('messageInfo');
        return;
    }

    noDataMessage.classList.add('hidden');

    solicitudesFiltradas.forEach(solicitud => {
        const card = document.createElement('div');
        card.className = 'applicationCard';
        card.dataset.id = solicitud.id; 

        let statusClass = '';
        if (solicitud.status === 'approved') {
            statusClass = 'statusApproved';
        } else if (solicitud.status === 'rejected') {
            statusClass = 'statusRejected';
        } else {
            statusClass = 'statusEarring';
        }

        const formatCurrency = (amount) => amount.toLocaleString('es-AR', { minimumFractionDigits: 2 });

        const pymeData = allPymes.find(pyme => pyme.id === solicitud.pyme_id) || {};


        card.innerHTML = `
            <h3>Solicitud #${solicitud.id} - ${pymeData.name_company}</h3>
            
            <div class="infoContainer">
                <div>
                    <p>Razon Social: <b>${pymeData.legal_form}</b></p>
                    <p>Forma Jurídica: ${pymeData.legal_form}</p>
                    <p>Email: ${pymeData.corporate_email}</p>
                </div>

                <div>
                    <p>C.U.I.T: ${pymeData.cuit}</p>
                    <p>Actividad Principal: ${pymeData.activity}</p>
                    <p>N° Telefono: ${pymeData.phone_number}</p>
                </div>
            </div>

            <div class="infoContainer">
                <div>
                    <p>Calle y Número: ${pymeData.address}</p>
                    <p>Provincia: ${pymeData.state}</p>
                    <p>Código Postal: ${pymeData.postal_code}</p>
                </div>

                <div>
                    <p>Piso/Dpto: </p>
                    <p>Ciudad/Localidad: ${pymeData.city}</p>
                </div>
            </div>

            <div class="infoContainer">
                <div>
                    <p>Fecha Cierre de Ejercicio: ${solicitud.fiscal_year_closing}</p>
                    <p>Activo Total ($): <b>${formatCurrency(solicitud.total_assets)}</b></p>
                </div>

                <div>
                    <p>Ventas Netas Anuales ($): <b>${formatCurrency(solicitud.annual_sales)}</b></p>
                    <p>Cant. de Empleados: ${solicitud.employees}</p>
                </div>
            </div>
            <div class="actions">
                <div>
                    <button class="approve" data-action="approved" ${solicitud.status !== 'pending' ? 'disabled' : ''}>Aprobar</button>
                    <button class="decline" data-action="rejected" ${solicitud.status !== 'pending' ? 'disabled' : ''}>Rechazar</button>
                </div>

                <span class="applicationStatus ${statusClass}">${solicitud.status}</span>
            </div>
        `;
        dashboardContainer.appendChild(card);
    });

    addActionListener();
}

function addActionListener() {
    const dashboardContainer = document.getElementById('dashboardContainer');
    dashboardContainer.querySelectorAll('.actions button').forEach(button => {
        button.addEventListener('click', (event) => {
            const card = event.target.closest('.applicationCard');
            const id = parseInt(card.dataset.id);
            const nuevoEstado = event.target.dataset.action; 

            updateSolicitudStatus(id, nuevoEstado);
        });
    });
}

async function updateSolicitudStatus(id, nuevoEstado) {
    try {
        await api.updateCreditStatus(id, nuevoEstado);
        renderDashboard();
        alert(`Solicitud #${id} marcada como: ${nuevoEstado}`);
    } catch (error) {
        console.error('Error updating credit status:', error);
        alert('Error al actualizar el estado de la solicitud.');
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    await setuplistCompanies();
    setupSearchFilter();
    
    if (!companieActive) {
        renderDashboard();
    }
});