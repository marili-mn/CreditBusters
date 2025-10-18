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

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        // Elige el modelo de Gemini que quieres usar
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Genera la respuesta
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error al procesar tu solicitud con Google AI.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port} y conectado a Google AI`);
});