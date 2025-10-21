import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();


/**
 * Normaliza un texto: lo convierte a minúsculas y le quita los acentos.
 * @param {string} text El texto a normalizar.
 * @returns {string} El texto normalizado.
 */

function normalizeText(text) {
return text
    .toLowerCase() // 1. Convertir a minúsculas
    .normalize("NFD") // 2. Descomponer caracteres (ej: "é" -> "e" + "´")
    .replace(/[\u0300-\u036f]/g, ""); // 3. Quitar todos los acentos
}


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Configuración del cliente de Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const predefinedResponses = {
    // --- Saludos y General ---
    "hola": "¡Hola! Bienvenido a CreditBusters. Estamos aquí para ayudarte a impulsar tu PYME. ¿Tienes preguntas sobre nuestros créditos o el proceso de solicitud? Escribe ayuda en el chat.",
    "adios": "¡Gracias por contactar a CreditBusters! Que tu PYME siga creciendo. ¡Hasta pronto!",
    "ayuda": "Soy el asistente virtual de CreditBusters. Puedes preguntar sobre requisitos, tasas y plazos de crédito. Pregúntame sobre 'quiénes somos', 'requisitos', 'proceso', 'tiempo de respuesta', 'por qué creditbusters', 'tienen app', 'tasas', 'monto máximo', 'plazos de pago', 'se puede refinanciar', 'qué tipo de créditos ofrecen'.",
    "quienes somos": "CreditBusters es una plataforma diseñada para eliminar la burocracia en la solicitud de créditos para PYMES, ofreciendo financiación rápida, sencilla y transparente.",

    // --- Preguntas Específicas sobre CREDITBUSTERS ---
    "requisitos": "Para solicitar un crédito en CreditBusters, generalmente necesitas: 1) Ser una PYME con al menos 6 meses de actividad. 2) Documentación legal básica de tu negocio. 3) Acceso a tus estados de cuenta bancarios (digitalmente).",
    "proceso": "Nuestro proceso es 100% online y toma menos de 10 minutos. Solo tienes que registrarte y llenar un formulario breve . Recibirás una respuesta pre-aprobatoria en minutos.",
    "tiempo de respuesta": "Garantizamos una respuesta pre-aprobatoria en *minutos* gracias a nuestra tecnología. Una vez confirmada la documentación, el desembolso se realiza típicamente en 24 a 48 horas hábiles.",
    "por que creditbusters": "Somos la alternativa a la burocracia bancaria. Ofrecemos **rapidez inigualable** y **transparencia total**, diseñados específicamente para las necesidades de flujo de caja de las PYMES.",
    "tienen app": "Actualmente, nuestra plataforma es 100% responsive y accesible desde cualquier navegador móvil. Estamos trabajando para lanzar una aplicación pronto.",
    
    // --- Preguntas sobre Créditos/Préstamos ---
    "tasas": "Nuestras tasas de interés son personalizadas y dependen del perfil de riesgo de tu PYME y del plazo de financiación. Para obtener una cotización precisa, te invitamos a que te registres y completes la solicitud.",
    "monto maximo": "El monto máximo de financiación varía según la capacidad de repago y los ingresos demostrables de tu PYME. Puedes solicitar un monto en la sección de 'Solicitud de Crédito'.",
    "plazos de pago": "Ofrecemos plazos flexibles que van desde los 3 hasta los 36 meses. Puedes elegir el que mejor se adapte al ciclo financiero de tu negocio.",
    "se puede refinanciar": "Sí, una vez que has demostrado un buen historial de pagos con nosotros, es posible solicitar una refinanciación o una ampliación de tu línea de crédito.",
    "que tipo de creditos ofrecen": "Ofrecemos créditos de capital de trabajo a corto y mediano plazo, así como líneas de crédito revolving (rotativas) para la gestión diaria de tu negocio.",

    // --- Greetings and General ---
    "hello": "Hello! Welcome to CreditBusters. We are here to help boost your SME. Do you have questions about our loans or the application process? Type 'help' in the chat.",
    "goodbye": "Thank you for contacting CreditBusters! May your SME continue to grow. See you soon!",
    "help": "I am the CreditBusters virtual assistant. You can ask about credit requirements, rates, and terms. Ask me about 'who we are', 'requirements', 'process', 'response time', 'why creditbusters', 'do you have an app', 'rates', 'maximum amount', 'payment terms', 'can i refinance', 'what types of loans do you offer'.",
    "who we are": "CreditBusters is a platform designed to eliminate bureaucracy in SME loan applications, offering fast, simple, and transparent financing.",

    // --- Specific Questions about CREDITBUSTERS ---
    "requirements": "To apply for a loan at CreditBusters, you generally need: 1) To be an SME with at least 6 months of activity. 2) Basic legal documentation for your business. 3) Access to your bank statements (digitally).",
    "process": "Our process is 100% online and takes less than 10 minutes. You just need to register and fill out a short form. You will receive a pre-approval response in minutes.",
    "response time": "We guarantee a pre-approval response in *minutes* thanks to our technology. Once the documentation is confirmed, the disbursement is typically made within 24 to 48 business hours.",
    "why creditbusters": "We are the alternative to banking bureaucracy. We offer **unmatched speed** and **total transparency**, designed specifically for the cash flow needs of SMEs.",
    "do you have an app": "Currently, our platform is 100% responsive and accessible from any mobile browser. We are working on launching an app soon.",
    
    // --- Questions about Credits/Loans ---
    "rates": "Our interest rates are personalized and depend on your SME's risk profile and the financing term. To get an accurate quote, we invite you to register and complete the application.",
    "maximum amount": "The maximum financing amount varies depending on your SME's repayment capacity and demonstrable income. You can request an amount in the 'Loan Application' section.",
    "payment terms": "We offer flexible terms ranging from 3 to 36 months. You can choose the one that best suits your business's financial cycle.",
    "can i refinance": "Yes, once you have demonstrated a good payment history with us, it is possible to request refinancing or an extension of your credit line.",
    "what types of loans do you offer": "We offer short and medium-term working capital loans, as well as revolving credit lines for the daily management of your business.",
    
};

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const normalizedMessage = normalizeText(message.trim()); // Normalizamos el mensaje del usuario

        // 1. Revisar si el mensaje existe en nuestras respuestas predefinidas
        if (predefinedResponses[normalizedMessage]) {
        // Si existe, enviamos la respuesta predefinida y terminamos
            console.log('Enviando respuesta predefinida para:', normalizedMessage);
            return res.json({ response: predefinedResponses[normalizedMessage] });
        }

        // 2. Si no hay respuesta predefinida, llamamos a la IA de Google
        console.log('Enviando a Google AI:', message);

        const systemInstruction = {
            role: "system",
            parts: [{ text: "Eres un chatbot asistente llamado 'BusterBot' que trabaja para CreditBusters, una empresa especializada en soluciones de crédito para pequeñas y medianas empresas (PYMES). Tu rol es interactuar directamente con usuarios que buscan información, asesoramiento y soporte relacionado con productos y servicios de préstamos diseñados específicamente para PYMES. Responde siempre en español y si te preguntan en ingles ahí si puedes responder en ingles."}]
        };

        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash", 
            systemInstruction: systemInstruction 
        });

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error al procesar tu solicitud.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port} y conectado a Google AI`);
});