import React, { useEffect, useRef, useState } from 'react';
import { fetchChatMessages, sendMessage } from '../../routes/chatRoutes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { IconAvatar } from '../../config/images';
import '../../styles/ChatWindow.scss';

export default function ChatWindow({ chat, currentUser, interlocutor, onBack }) {
    const textAreaRef = useRef(null);
    const messagesEndRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    // 🔹 Charger les anciens messages
    useEffect(() => {
        if (!chat) return;
        setLoading(true);
        const loadMessages = async () => {
            const chatID = chat?.id;
            const result = await fetchChatMessages(chatID);
            if (result.success) {
                setMessages(result.messages);
            }
            setLoading(false);
        };
        if (chat?.id) {
            loadMessages();
        }
    }, [chat]);


    // 🔹 Scroller automatiquement vers le dernier message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Auto-ajustement du textarea
    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto';
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    }, [newMessage]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        const senderID = currentUser?.uid;
        const receiverID = interlocutor?.uid;
        const result = await sendMessage(senderID, receiverID, newMessage);
        if (result.success) {
            setMessages((prev) => [...prev, result.message]);
            setNewMessage('');
        }
    };

    const formatOnlineStatus = (isOnline) => {
        switch (isOnline) {
            case true:
                return '🟢 En ligne';
            case false:
                return '🔴 Hors ligne';
            default:
                return '🟠 Inconnu';
        }
    };

    return (
        <div className="chat-window">
            <div className="chat-header">
                <button className="back-button" onClick={onBack}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <img src={interlocutor?.profilURL ?? IconAvatar} alt={interlocutor?.displayName} />
                <div>
                    <h4>{interlocutor?.displayName || "Utilisateur"}</h4>
                    <span> {formatOnlineStatus(interlocutor?.isOnline)} </span>
                </div>
            </div>
            <div className="chat-messages">
                {loading ? (
                    <p>Chargement...</p>
                ) : messages.length === 0 ? (
                    <p>Aucun message</p>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.senderID === currentUser.uid ? 'sent' : 'received'}`}>
                            <p>{msg.text}</p>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} /> {/* 🔹 Pour auto-scroll */}
            </div>
            <div className="chat-input">
                <textarea ref={textAreaRef} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Écrire un message..."></textarea>
                <button onClick={handleSendMessage}>
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
            </div>
        </div>
    );
}
