
document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('theme-toggle');
    const body = document.body;
    toggleButton.innerHTML = '🌙 Modo Oscuro';

    toggleButton.addEventListener('click', function() {
        body.classList.toggle('dark-theme');
        if (body.classList.contains('dark-theme')) {
            this.innerHTML = '☀️ Modo Claro';
        } else {
            this.innerHTML = '🌙 Modo Oscuro';
        }
    });

    const api = new Api();
    const form = document.querySelector('form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const pyme_data = {
            name_company: formData.get('razon_social'),
            cuit: formData.get('cuit'),
            legal_form: formData.get('forma_juridica'),
            activity: formData.get('clae'),
            corporate_email: formData.get('email'),
            phone_number: formData.get('telefono'),
            country: formData.get('pais'),
            state: formData.get('provincia'),
            city: formData.get('ciudad'),
            address: formData.get('calle'),
            postal_code: formData.get('cp'),
        };

        const credit_create = {
            amount: parseFloat(formData.get('monto_solicitado')),
            employees: parseInt(formData.get('empleados')),
            annual_sales: parseFloat(formData.get('ventas_anuales')),
            fiscal_year_closing: formData.get('cierre_ejercicio'),
            total_assets: parseFloat(formData.get('activo_total')),
        };
        
        const creditData = {
            credit_create: credit_create,
            pyme_data: pyme_data
        };

        try {
            await api.createCredit(creditData);
            alert('Solicitud de crédito creada con éxito');
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error('Error creating credit:', error);
            alert('Error al crear la solicitud de crédito.');
        }
    });


        // Definimos una clave única para guardar los datos de este formulario
    const STORAGE_KEY = 'creditFormData';
    
    // Seleccionamos el formulario por el ID que le dimos

    // Si el formulario no existe en la página, detenemos el script
    if (!form) {
        console.error('¡Error! No se encontró el formulario con id="creditForm"');
        return;
    }

    function loadFormData() {
        // Obtiene los datos guardados (en formato JSON string)
        const savedData = localStorage.getItem(STORAGE_KEY);

        if (savedData) {
            // Convierte el JSON string de nuevo a un objeto
            const data = JSON.parse(savedData);
            
            // Recorre cada dato guardado (ej: { razon_social: 'Mi Empresa' })
            Object.keys(data).forEach(key => {
                // Busca el campo en el formulario que tenga ese 'name'
                const element = form.elements[key];
                
                if (element) {
                    // Diferencia entre checkboxes y otros campos
                    if (element.type === 'checkbox') {
                        element.checked = data[key]; // data[key] será true o false
                    } 
                    // No intentamos rellenar campos de tipo 'file'
                    else if (element.type !== 'file') {
                        element.value = data[key]; // data[key] será el texto
                    }
                }
            });
            console.log('Datos del formulario cargados desde LocalStorage.');
        }
    }

    /**
     * --- 2. FUNCIÓN PARA GUARDAR DATOS ---
     * Se ejecuta CADA VEZ que el usuario escribe, selecciona o marca algo.
     */
    form.addEventListener('input', (e) => {
        const target = e.target; // El elemento que cambió (input, select, etc.)

        // No guardamos campos de archivo ni elementos sin 'name'
        if (target.type === 'file' || !target.name) {
            return;
        }

        // Obtiene los datos actuales de localStorage (o crea un objeto vacío)
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

        // Determina qué valor guardar
        // Si es un checkbox, guarda 'true/false'. Si no, guarda el 'value' (texto).
        const value = target.type === 'checkbox' ? target.checked : target.value;

        // Actualiza el objeto con el nuevo valor
        data[target.name] = value;

        // Guarda el objeto actualizado (como JSON string) en localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    });

    // FUNCIÓN PARA LIMPIAR DATOS (Se ejecuta SÓLO CUANDO el formulario se envía exitosamente.)
    form.addEventListener('submit', () => {
        // Limpia el localStorage para este formulario
        localStorage.removeItem(STORAGE_KEY);
        
        console.log('Formulario enviado. LocalStorage limpiado.');
        // No necesitamos e.preventDefault(), ya que queremos que el formulario SÍ se envíe.
    });

    // --- EJECUCIÓN INICIAL ---
    // Llama a la función de carga cuando la página está lista
    loadFormData();
});

