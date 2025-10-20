import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

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
    "quiénes somos": "CreditBusters es una plataforma diseñada para eliminar la burocracia en la solicitud de créditos para PYMES, ofreciendo financiación rápida, sencilla y transparente.",

    // --- Preguntas Específicas sobre CREDITBUSTERS ---
    "requisitos": "Para solicitar un crédito en CreditBusters, generalmente necesitas: 1) Ser una PYME con al menos 6 meses de actividad. 2) Documentación legal básica de tu negocio. 3) Acceso a tus estados de cuenta bancarios (digitalmente).",
    "proceso": "Nuestro proceso es 100% online y toma menos de 10 minutos. Solo tienes que registrarte y llenar un formulario breve . Recibirás una respuesta pre-aprobatoria en minutos.",
    "tiempo de respuesta": "Garantizamos una respuesta pre-aprobatoria en *minutos* gracias a nuestra tecnología. Una vez confirmada la documentación, el desembolso se realiza típicamente en 24 a 48 horas hábiles.",
    "por qué creditbusters": "Somos la alternativa a la burocracia bancaria. Ofrecemos **rapidez inigualable** y **transparencia total**, diseñados específicamente para las necesidades de flujo de caja de las PYMES.",
    "tienen app": "Actualmente, nuestra plataforma es 100% responsive y accesible desde cualquier navegador móvil. Estamos trabajando para lanzar una aplicación pronto.",
    
    // --- Preguntas sobre Créditos/Préstamos ---
    "tasas": "Nuestras tasas de interés son personalizadas y dependen del perfil de riesgo de tu PYME y del plazo de financiación. Para obtener una cotización precisa, te invitamos a que te registres y completes la solicitud.",
    "monto máximo": "El monto máximo de financiación varía según la capacidad de repago y los ingresos demostrables de tu PYME. Puedes solicitar un monto en la sección de 'Solicitud de Crédito'.",
    "plazos de pago": "Ofrecemos plazos flexibles que van desde los 3 hasta los 36 meses. Puedes elegir el que mejor se adapte al ciclo financiero de tu negocio.",
    "se puede refinanciar": "Sí, una vez que has demostrado un buen historial de pagos con nosotros, es posible solicitar una refinanciación o una ampliación de tu línea de crédito.",
    "qué tipo de créditos ofrecen": "Ofrecemos créditos de capital de trabajo a corto y mediano plazo, así como líneas de crédito revolving (rotativas) para la gestión diaria de tu negocio.",
    
};

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const lowerCaseMessage = message.toLowerCase().trim(); // Normalizamos el mensaje del usuario

        // 1. Revisar si el mensaje existe en nuestras respuestas predefinidas
        if (predefinedResponses[lowerCaseMessage]) {
        // Si existe, enviamos la respuesta predefinida y terminamos
            console.log('Enviando respuesta predefinida para:', lowerCaseMessage);
            return res.json({ response: predefinedResponses[lowerCaseMessage] });
        }

        // 2. Si no hay respuesta predefinida, llamamos a la IA de Google
        console.log('Enviando a Google AI:', message);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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