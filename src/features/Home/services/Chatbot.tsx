import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../../../style/inicio.css'; 
import IconBot from '../../../assets/icons/image-removebg-preview.ico'
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

const Chatbot: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const messageInputRef = useRef<HTMLInputElement>(null);
    const messageAreaRef = useRef<HTMLDivElement>(null);

    const displayMessage = useCallback((sender: 'user' | 'bot', message: string) => {
        setMessages(prevMessages => [...prevMessages, { sender, text: message }]);
    }, [setMessages]);

    const sendMessage = useCallback(async () => {
        const messageInput = messageInputRef.current;
        const messageArea = messageAreaRef.current;

        if (!messageInput) return;
        const messageText = messageInput.value;

        if (messageText.trim() !== '') {
            displayMessage('user', messageText);
            setIsTyping(true);

            try {
                const response = await fetch('https://backendhuertomkt.onrender.com/api/chatbot/message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message: messageText })
                });

                console.log('Response status:', response.status);
                const data = await response.json();
                console.log('Response data:', data);

                // Verificar diferentes formatos posibles de respuesta
                const botResponse = data.response || data.message || data.answer || data;
                if (typeof botResponse === 'string') {
                    displayMessage('bot', botResponse);
                } else if (typeof botResponse === 'object') {
                    displayMessage('bot', JSON.stringify(botResponse));
                } else {
                    displayMessage('bot', 'Lo siento, no pude procesar la respuesta del servidor.');
                }
            } catch (error) {
                console.error('Error completo:', error);
                displayMessage('bot', "Lo siento, hubo un error al procesar tu pregunta. Por favor, intenta de nuevo.");
            } finally {
                setIsTyping(false);
            }

            messageInput.value = '';
            if (messageArea) {
                messageArea.scrollTop = messageArea.scrollHeight;
            }
        }
    }, [displayMessage, messageInputRef, messageAreaRef]);

    useEffect(() => {
        const messageArea = messageAreaRef.current;
        if (messageArea) {
            messageArea.scrollTop = messageArea.scrollHeight;
        }
    }, [messages, messageAreaRef]);  // Depende de 'messages' para scroll al agregar mensajes


    const handleSendMessageClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        sendMessage();
    };

    const handleCloseClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setIsActive(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className={`floating-icon ${isActive ? 'active' : ''}`} onClick={ () => setIsActive(!isActive)}>
            <div className="help-text">¡Necesitas ayuda!</div>
            <img src={IconBot} alt="Icono de Mensaje" />
            <div className="text-bar" onClick={(event) => event.stopPropagation()}>
                <div className="chat-header" style={{ color: 'black' }}>
                    Tu Chatbot Asistente de HuertoMKT

                    <button className="close-button" onClick={handleCloseClick}>
                        <CloseIcon />
                    </button>
                </div>
                <div className="message-area" ref={messageAreaRef}>
                    {messages.map((message, index) => (
                        <div key={index} className={`message-bubble ${message.sender}-message`}>
                            {message.text}
                        </div>
                    ))}
                    {isTyping && (
                        <div className="typing-indicator">
                            <span>Respondiendo</span>
                            <div className="typing-dots">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        id="message-input"
                        placeholder="Escribe tu mensaje..."
                        ref={messageInputRef}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        type="button"
                        id="send-button"
                        onClick={handleSendMessageClick}
                    >
                        <SendIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;