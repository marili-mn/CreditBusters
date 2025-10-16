# CreditBusters

CreditBusters es una aplicación web diseñada para agilizar el proceso de solicitud de créditos para PYMES. La aplicación cuenta con un panel de control para usuarios y un panel de administración para la gestión de solicitudes de crédito.

## Características

- **Autenticación de usuarios:** Registro, inicio de sesión y recuperación de contraseña.
- **Paneles de control por roles:** Paneles de control separados para usuarios y administradores.
- **Solicitud de créditos:** Los usuarios pueden solicitar nuevos créditos a través de un formulario.
- **Gestión de créditos (Admin):** Los administradores pueden ver y gestionar todas las solicitudes de crédito.
- **Integración con API REST:** El frontend está totalmente integrado con una API REST para la gestión de datos.
- **Diseño receptivo:** La aplicación está diseñada para funcionar en dispositivos de escritorio y móviles.

## Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Font Awesome (para iconos)

## Estructura del Proyecto

```
/CreditBusters
├── css/
│   ├── dashboard-admin.css
│   ├── dashboard-styles.css
│   ├── form-style.css
│   ├── home-styles.css
│   └── styles.css
├── images/
│   ├── imgSectionAboutUs.png
│   └── imgSectionHome.png
├── js/
│   ├── api.js
│   ├── app.js
│   ├── dashboard.js
│   ├── dashboardAdmin.js
│   └── formApp.js
├── views/
│   ├── dashboard-admin.html
│   ├── dashboard.html
│   ├── form-data.html
│   ├── log-in.html
│   ├── password-user.html
│   ├── register-user.html
│   └── reset-password.html
├── .gitignore
├── index.html
└── README.md
```

## Cómo Empezar

Para ejecutar el proyecto localmente, sigue estos pasos:

1.  **Clona el repositorio:**

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    ```

2.  **Navega al directorio del proyecto:**

    ```bash
    cd CreditBusters
    ```

3.  **Inicia un servidor web local:**

    Puedes usar cualquier servidor web local para servir los archivos del proyecto. Si tienes Python instalado, puedes usar el siguiente comando:

    ```bash
    python -m http.server
    ```

    Esto iniciará un servidor en `http://localhost:8000`.

4.  **Abre la aplicación en tu navegador:**

    Abre tu navegador y ve a `http://localhost:8000`.

## Guía de Pruebas Locales

Para probar la aplicación localmente antes de subirla a producción, sigue esta guía. La aplicación está configurada para consumir la API de producción (`https://creditsbuster.onrender.com/`), por lo que no se necesita ninguna configuración adicional.

### Pasos para Probar

1.  **Registro de Usuario:**
    *   Ve a la página de registro (`/views/register-user.html`).
    *   Completa el formulario con datos de prueba y envíalo.
    *   Verifica que eres redirigido a la página de inicio de sesión.

2.  **Inicio de Sesión:**
    *   Ve a la página de inicio de sesión (`/views/log-in.html`).
    *   Inicia sesión con las credenciales del usuario que acabas de crear.
    *   Verifica que eres redirigido al panel de control del usuario (`/views/dashboard.html`).
    *   Cierra la sesión y vuelve a iniciarla con credenciales de administrador.
    *   Verifica que eres redirigido al panel de control de administrador (`/views/dashboard-admin.html`).

3.  **Recuperación de Contraseña:**
    *   Ve a la página de recuperación de contraseña (`/views/password-user.html`).
    *   Introduce el correo electrónico de un usuario registrado y envía el formulario.
    *   Ve a la página de restablecimiento de contraseña (`/views/reset-password.html`).
    *   Introduce el código de reinicio (necesitarás obtenerlo del backend), y una nueva contraseña.
    *   Verifica que puedes iniciar sesión con la nueva contraseña.

4.  **Solicitud de Crédito (Usuario Normal):**
    *   Inicia sesión como usuario normal.
    *   En el panel de control del usuario, haz clic en "Solicitar Nuevo Crédito".
    *   Completa el formulario de solicitud de crédito y envíalo.
    *   Verifica que la nueva solicitud de crédito aparece en la lista de solicitudes.

5.  **Gestión de Créditos (Admin):**
    *   Inicia sesión como administrador.
    *   En el panel de control de administrador, selecciona una empresa de la lista.
    *   Verifica que se muestran las solicitudes de crédito para esa empresa.
    *   Aprueba o rechaza una solicitud de crédito pendiente.
    *   Verifica que el estado de la solicitud se actualiza correctamente.

## Buenas Prácticas y Mejoras Futuras

### Estructura del Proyecto y HTML

- **Consolidar archivos CSS:** Considera la posibilidad de consolidar los múltiples archivos CSS en un único archivo `main.css` o en archivos CSS modulares que se importen en un archivo principal para reducir el número de solicitudes HTTP y simplificar la gestión de los estilos.
- **Usar un `favicon`:** Añade un `favicon` a todas las páginas HTML para mejorar la identidad de la marca en las pestañas del navegador.
- **Semántica HTML:** Mejora la semántica HTML en algunas áreas. Por ejemplo, en `index.html`, los `<span>` dentro de la clase `aboutUsGrid` podrían ser `<article>` o `<div>`.
- **Atributos `alt` en las imágenes:** Asegúrate de que todas las imágenes tengan atributos `alt` descriptivos para mejorar la accesibilidad.

### CSS

- **Metodología BEM:** Considera el uso de una metodología como BEM (Bloque, Elemento, Modificador) para nombrar las clases CSS para que el CSS sea más legible, mantenible y escalable.
- **Unidades relativas:** Usa unidades relativas como `rem` o `em` para los tamaños de fuente, `padding` y `margin` en lugar de `px` para mejorar la accesibilidad.
- **Simplificar selectores:** Simplifica los selectores de CSS para reducir el acoplamiento y facilitar la reutilización.
- **Organización del CSS:** Organiza el CSS en secciones lógicas o por componente para facilitar la búsqueda y modificación de estilos.

### JavaScript

- **Manejo de errores:** Mejora el manejo de errores en las llamadas a la API para proporcionar mensajes de error más específicos al usuario.
- **Variables de entorno:** Almacena la URL base de la API en una variable de entorno para poder cambiarla fácilmente entre los entornos de desarrollo y producción.
- **Seguridad del token:** Para una mayor seguridad, considera almacenar el token JWT en una cookie `HttpOnly` para evitar ataques XSS. Esto requeriría cambios en el backend.
- **Nombres de funciones:** Usa nombres de funciones más descriptivos para reflejar mejor lo que hacen.
- **Comentarios:** Añade comentarios al código para explicar la lógica compleja o las decisiones importantes.