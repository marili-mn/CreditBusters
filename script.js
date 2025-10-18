document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

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
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});