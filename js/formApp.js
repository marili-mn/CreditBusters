
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
});
