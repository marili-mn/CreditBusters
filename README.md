Librerías necesarias que deben ser importadas para el funcionamiento del chatbot:
    --express.
    --@google/generative-ai.
    --dotenv.
    --cors.

IMPORTANTE: 
    Para tener las librerías debe ejecutarse dentro de la carpeta del proyecto (usando su terminal preferida, en mi caso use Git Bash): 'npm install'. Npm leerá el archivo package.json y descargará todas las librerías necesarias (Express, Google AI, dotenv, etc.) en una carpeta local llamada node_modules.

Pasos para hacer funcionar al chatbot:

1) Loguearse en Google AI Studio (https://aistudio.google.com/).

2) Crea una Clave de API:
    --En el menú inferior de la izquierda, haz clic en "Get API key" (Obtener clave de API).

    --Haz clic en "Create API key" (Crear clave de API en un nuevo proyecto).

    --Se generará una nueva clave. Cópiala y guárdala en un lugar seguro. 

3) Crear un archivo .env en el directorio raiz del proytecto.

4) En el archivo .env agregar la siguiente línea: GOOGLE_API_KEY=tu_clave_secreta_de_google_ai (Aqui va la Api Key otorgada por Google).

5) Ejecutar en terminal: npm run dev.

6) Si se accede desde la conexión que aparece en la terminal no funcionara, aparecerá en la página 'Cannot GET /'.

7) Para solucionar el error del paso 6 se debe ir a la carpeta del proyecto y ejecutar directamente (doble click) el archivo 'index.html'.

8) Listo, debería de funcionar.

DATO IMPORTANTE: 
Este chatbot lo hice funcionar en Windows 10, no sé cómo se comportara en otros sistemas operativos.

POSDATA: 
Cualquier error (más allá del ya mencionado en el paso 6) que surja consultar con su Foro o IA favorita, suerte! :).