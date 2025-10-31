document.addEventListener('DOMContentLoaded', function () {
    const autoFillButton = document.getElementById('autoFillButton');
    const submitButton = document.getElementById('submit-form');
    const form = document.getElementById('credit-form');

    // --- Lógica para autocompletado variado ---
    let autofillCounter = 0;
    const dummyDataSets = [
        {
            razon_social: 'TecnoFuturo S.A.',
            cuit: '30-11223344-5',
            forma_juridica: 'SA',
            clae: 'Venta de Hardware y Software',
            email: 'contacto@tecnofuturo.com',
            telefono: '+54 9 11 3333-4444',
            calle: 'Cerrito 180',
            piso_dpto: 'Piso 3, Of. A',
            pais: 'Argentina',
            provincia: 'Buenos Aires',
            ciudad: 'CABA',
            cp: 'C1010AAP',
            monto_solicitado: '250000',
            plazo: '36',
            destino_credito: 'Compra de stock de microchips',
            garantias: 'Aval de socios mayoritarios',
            cierre_ejercicio: '2023-12-31',
            ventas_anuales: '3500000',
            activo_total: '2100000',
            empleados: '25',
            declaracion_jurada: true,
            autorizacion: true,
            tyc: true
        },
        {
            razon_social: 'GastroDelicias S.R.L.',
            cuit: '33-55667788-9',
            forma_juridica: 'SRL',
            clae: 'Servicios de Catering',
            email: 'pedidos@gastrodelicias.com',
            telefono: '+54 9 351 5555-6666',
            calle: 'Av. Colón 4500',
            piso_dpto: 'Local 12',
            pais: 'Argentina',
            provincia: 'Córdoba',
            ciudad: 'Córdoba',
            cp: 'X5000HUA',
            monto_solicitado: '85000',
            plazo: '18',
            destino_credito: 'Renovación de equipamiento de cocina',
            garantias: 'Garantía prendaria sobre vehículos',
            cierre_ejercicio: '2023-09-30',
            ventas_anuales: '1200000',
            activo_total: '700000',
            empleados: '12',
            declaracion_jurada: true,
            autorizacion: true,
            tyc: true
        },
        {
            razon_social: 'Logística Global SAS',
            cuit: '30-99887766-1',
            forma_juridica: 'SAS',
            clae: 'Transporte y Logística',
            email: 'info@logisticaglobal.net',
            telefono: '+54 9 261 7777-8888',
            calle: 'Ruta 7 Km 1020',
            piso_dpto: '',
            pais: 'Argentina',
            provincia: 'Mendoza',
            ciudad: 'Godoy Cruz',
            cp: 'M5501',
            monto_solicitado: '500000',
            plazo: '48',
            destino_credito: 'Adquisición de nueva flota de vehículos',
            garantias: 'Hipoteca sobre depósito',
            cierre_ejercicio: '2023-12-31',
            ventas_anuales: '5000000',
            activo_total: '3800000',
            empleados: '40',
            declaracion_jurada: true,
            autorizacion: true,
            tyc: true
        }
    ];

    autoFillButton.addEventListener('click', function () {
        const data = dummyDataSets[autofillCounter % dummyDataSets.length];
        fillFormFields(data);
        autofillCounter++;
        saveFormDataDraft(); // Guardar el borrador después de autocompletar
    });

    function fillFormFields(data) {
        document.getElementById('razon_social').value = data.razon_social || '';
        document.getElementById('cuit').value = data.cuit || '';
        document.getElementById('forma_juridica').value = data.forma_juridica || '';
        document.getElementById('clae').value = data.clae || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('telefono').value = data.telefono || '';
        document.getElementById('calle').value = data.calle || '';
        document.getElementById('piso_dpto').value = data.piso_dpto || '';
        document.getElementById('pais').value = data.pais || '';
        document.getElementById('provincia').value = data.provincia || '';
        document.getElementById('ciudad').value = data.ciudad || '';
        document.getElementById('cp').value = data.cp || '';
        document.getElementById('monto_solicitado').value = data.monto_solicitado || '';
        document.getElementById('plazo').value = data.plazo || '';
        document.getElementById('destino_credito').value = data.destino_credito || '';
        document.getElementById('garantias').value = data.garantias || '';
        document.getElementById('cierre_ejercicio').value = data.cierre_ejercicio || '';
        document.getElementById('ventas_anuales').value = data.ventas_anuales || '';
        document.getElementById('activo_total').value = data.activo_total || '';
        document.getElementById('empleados').value = data.empleados || '';
        document.getElementById('declaracion_jurada').checked = data.declaracion_jurada || false;
        document.getElementById('autorizacion').checked = data.autorizacion || false;
        document.getElementById('tyc').checked = data.tyc || false;
    }

    // --- Cargar borrador al iniciar la página ---
    const savedDraft = localStorage.getItem('creditFormDataDraft');
    if (savedDraft) {
        const draftData = JSON.parse(savedDraft).fullData; // Acceder a fullData
        fillFormFields(draftData);
    }

    // --- Guardar borrador automáticamente al cambiar un campo ---
    form.addEventListener('input', saveFormDataDraft);
    form.addEventListener('change', saveFormDataDraft);

    function saveFormDataDraft() {
        const fullData = {
            razon_social: document.getElementById('razon_social').value,
            cuit: document.getElementById('cuit').value,
            forma_juridica: document.getElementById('forma_juridica').value,
            clae: document.getElementById('clae').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            calle: document.getElementById('calle').value,
            piso_dpto: document.getElementById('piso_dpto').value,
            pais: document.getElementById('pais').value,
            provincia: document.getElementById('provincia').value,
            ciudad: document.getElementById('ciudad').value,
            cp: document.getElementById('cp').value,
            monto_solicitado: document.getElementById('monto_solicitado').value,
            plazo: document.getElementById('plazo').value,
            destino_credito: document.getElementById('destino_credito').value,
            garantias: document.getElementById('garantias').value,
            cierre_ejercicio: document.getElementById('cierre_ejercicio').value,
            ventas_anuales: document.getElementById('ventas_anuales').value,
            activo_total: document.getElementById('activo_total').value,
            empleados: document.getElementById('empleados').value,
            declaracion_jurada: document.getElementById('declaracion_jurada').checked,
            autorizacion: document.getElementById('autorizacion').checked,
            tyc: document.getElementById('tyc').checked
        };

        const sessionData = {
            companyName: fullData.razon_social,
            creditType: fullData.destino_credito,
            amount: fullData.monto_solicitado,
            fullData: fullData // Anidar el objeto completo con todos los datos
        };

        localStorage.setItem('creditFormDataDraft', JSON.stringify(sessionData));
    }

    submitButton.addEventListener('click', function () {
        if (validateForm()) {
            // La función saveFormDataDraft ya se llama con cada cambio, 
            // así que el borrador en localStorage está actualizado.
            // Simplemente redirigimos a la página de firma.
            window.location.href = 'sign-document.html';
        }
    });

    function validateForm() {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (field.type === 'checkbox') {
                if (!field.checked) {
                    isValid = false;
                    alert('Debe aceptar todas las declaraciones.');
                }
            } else {
                if (field.value.trim() === '') {
                    isValid = false;
                    field.style.border = '1px solid red';
                } else {
                    field.style.border = '';
                }
            }
        });
        if (!isValid) {
            alert('Por favor, complete todos los campos obligatorios.');
        }
        return isValid;
    }
});
