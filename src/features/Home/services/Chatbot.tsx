import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { HTMLAttributes } from 'react';
import '../../../style/inicio.css'; 
import IconBot from '../../../assets/icons/iconbot.png'
import IconEnvio from '../../../assets/icons/iconEnviar.png'
import { IoCloseCircle } from "react-icons/io5";

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

const Chatbot: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
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

            try {
                const response = await fetch('https://backendhuertomkt.onrender.com/api/chatbot/message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message: messageText })
                });

                const data = await response.json();
                const botResponse = data.message;
                displayMessage('bot', botResponse);
            } catch (error) {
                console.error('Error al obtener la respuesta del bot:', error);
                displayMessage('bot', "Lo siento, hubo un error al procesar tu pregunta.");
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


    const handleSendMessageClick = (event: React.MouseEvent<HTMLImageElement>) => {
        event.preventDefault();
        sendMessage();
    };

    const handleCloseClick = (event: React.MouseEvent<SVGElement>) => {
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
                <div className="chat-header">
                    Tu Chatbot Asistente de HuertoMKT
                    <IoCloseCircle className="close-button" onClick={handleCloseClick} />
                </div>
                <div className="message-area" ref={messageAreaRef}>
                    {messages.map((message, index) => (
                        <div key={index} className={`message-bubble ${message.sender}-message`}>
                            {message.text}
                        </div>
                    ))}
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        id="message-input"
                        placeholder="Escribe tu mensaje..."
                        ref={messageInputRef}
                        onKeyDown={handleKeyDown} // Usamos onKeyDown directamente
                    />
                    <img
                        src={IconEnvio}
                        alt="Enviar"
                        id="send-button-img"
                        onClick={handleSendMessageClick}
                    />
                </div>
            </div>
        </div>
    );
};

export default Chatbot;