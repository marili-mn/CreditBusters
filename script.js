document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const btnChatBot = document.getElementById('btnChatBot');
    const chatCointaner = document.getElementById('chat-container');

    const messageOfWelcome = "Hola!😄, soy BusterBot🤖 el asistente virtual de ⚡CreditBusters. Puedes pregúntarme sobre 'quiénes somos', 'requisitos', 'proceso', 'tiempo de respuesta', 'por qué creditbusters', 'tienen app', 'tasas', 'monto máximo', 'plazos de pago', 'se puede refinanciar', 'qué tipo de créditos ofrecen'.";

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    async function sendMessage() {
        const message = userInput.value;
        if (message.trim() === '') return;

        displayMessage(message, 'user');
        userInput.value = '';

        try {
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            const data = await response.json();
            displayMessage(data.response, 'bot');
        } catch (error) {
            displayMessage('Lo siento, hubo un error.', 'bot');
        }
    }

    function displayMessage(message, sender) {
        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        messageElement.classList.add(sender);
        if (sender == 'user'){
            messageElement.style.textAlign = 'end';
            messageElement.style.color = 'var(--secondary-color)';
        } else if (sender == 'bot'){
            messageElement.style.borderRadius = '15px';
            messageElement.style.padding = '10px';
            messageElement.style.backgroundColor = 'var(--bg-color)';
        }
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    

    btnChatBot.addEventListener('click', ()=>{
        chatCointaner.classList.toggle('oculto');

        if(chatBox.textContent == ''){
            const messageWelcome = document.createElement('p');
            messageWelcome.textContent = messageOfWelcome;
            messageWelcome.style.borderRadius = '15px';
            messageWelcome.style.padding = '10px';
            messageWelcome.style.backgroundColor = 'var(--bg-color)';
            chatBox.appendChild(messageWelcome);
        }
    })
});