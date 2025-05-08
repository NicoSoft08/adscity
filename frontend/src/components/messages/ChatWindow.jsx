import React, { useEffect, useRef, useState } from 'react';
import { fetchChatMessages, sendMessage } from '../../routes/chatRoutes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCheckDouble, faChevronLeft, faEllipsisV, faPaperPlane, faSmile } from '@fortawesome/free-solid-svg-icons';
import { IconAvatar } from '../../config/images';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import EmojiPicker from 'emoji-picker-react';
import { fetchDataByUserID } from '../../routes/userRoutes';
import '../../styles/ChatWindow.scss';

export default function ChatWindow({ chat, currentUser, onBack }) {
    const textAreaRef = useRef(null);
    const messagesEndRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [interlocutor, setInterlocutor] = useState(null);

    // 📌 Récupérer les infos de l’interlocuteur
    useEffect(() => {
        if (!chat || !currentUser) return;

        const fetchInterlocutor = async () => {
            if (chat && chat.participants) {
                const userID = currentUser?.uid;
                const participants = chat.participants || [];
                const interlocutorID = participants.find(participant => participant !== userID);

                if (interlocutorID) {
                    const result = await fetchDataByUserID(interlocutorID);
                    if (result.success) {
                        setInterlocutor(result.data);
                    }
                }
            }
        };

        fetchInterlocutor();
    }, [chat, currentUser]);


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
            textAreaRef.current.style.height = `${Math.min(textAreaRef.current.scrollHeight, 120)}px`;
        }
    }, [newMessage]);

    // Simuler l'état de frappe (à remplacer par une implémentation réelle)
    useEffect(() => {
        if (newMessage.trim().length > 0) {
            // Envoyer un signal "est en train d'écrire" à l'autre utilisateur
            // Cette partie dépendrait de votre implémentation backend
        }
    }, [newMessage]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const senderID = currentUser?.uid;
        const receiverID = interlocutor?.userID;

        // Message temporaire pour affichage immédiat
        const tempId = `temp-${Date.now()}`;
        const tempMessage = {
            id: tempId,
            text: newMessage,
            senderID,
            receiverID,
            createdAt: new Date(),
            status: 'sending',
            isTemporary: true // utile pour filtrer plus tard
        };

        // 1. Affichage immédiat
        setMessages(prev => [...prev, tempMessage]);
        setNewMessage('');
        setShowEmojiPicker(false);

        try {
            const idToken = await currentUser.getIdToken();
            const result = await sendMessage(senderID, receiverID, idToken, newMessage);

            if (result.success && result.message) {
                const now = new Date();

                // 2. Remplacement du message temporaire par celui renvoyé depuis le backend
                setMessages(prev =>
                    prev.map(msg =>
                        msg.id === tempId
                            ? {
                                ...result.message,
                                status: 'sent',
                                createdAt:
                                    result.message.createdAt || now, // Assurez-vous que createdAt est toujours une date valide
                            }
                            : msg
                    )
                );
            } else {
                throw new Error(result.error || "Erreur d'envoi");
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi du message:", error);
            // 3. Marquer le message comme échoué
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === tempId ? { ...msg, status: 'failed' } : msg
                )
            );
        }
    };


    // const handleSendMessage = async () => {
    //     if (!newMessage.trim()) return;

    //     const senderID = currentUser?.uid;
    //     const receiverID = interlocutor?.userID;

    //     // Optimistic UI update
    //     const tempMessage = {
    //         id: `temp-${Date.now()}`,
    //         text: newMessage,
    //         senderID,
    //         receiverID,
    //         createdAt: new Date(),
    //         status: 'sending'
    //     };

    //     setMessages(prev => [...prev, tempMessage]);
    //     setNewMessage('');
    //     setShowEmojiPicker(false);

    //     try {
    //         const idToken = await currentUser.getIdToken();
    //         const result = await sendMessage(senderID, receiverID, idToken, newMessage);

    //         if (result.success) {
    //             // Remplacer le message temporaire par le message confirmé
    //             setMessages(prev =>
    //                 prev.map(msg =>
    //                     msg.id === tempMessage.id ? { ...result.message, status: 'sent' } : msg
    //                 )
    //             );
    //         } else {
    //             // Marquer le message comme échoué
    //             setMessages(prev =>
    //                 prev.map(msg =>
    //                     msg.id === tempMessage.id ? { ...msg, status: 'failed' } : msg
    //                 )
    //             );
    //         }
    //     } catch (error) {
    //         console.error("Erreur lors de l'envoi du message:", error);
    //         // Marquer le message comme échoué
    //         setMessages(prev =>
    //             prev.map(msg =>
    //                 msg.id === tempMessage.id ? { ...msg, status: 'failed' } : msg
    //             )
    //         );
    //     }
    // };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleEmojiClick = (emojiData) => {
        setNewMessage(prev => prev + emojiData.emoji);
    };

    const formatOnlineStatus = (isOnline) => {
        if (isOnline === true) {
            return <span className="status online">En ligne</span>;
        } else if (isOnline === false) {
            return <span className="status offline">Hors ligne</span>;
        } else {
            return <span className="status unknown">Statut inconnu</span>;
        }
    };

    const formatMessageTime = (timestamp) => {
        if (!timestamp) return '';

        const options = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: false
        }

        const messageTime = new Date(timestamp?._seconds * 1000);

        return messageTime.toLocaleString('fr-FR', options);
    };

    const renderMessageStatus = (message) => {
        if (message.senderID !== currentUser.uid) return null;

        switch (message.status) {
            case 'sending':
                return <span className="message-status sending"><FontAwesomeIcon icon={faCheck} /></span>;
            case 'sent':
                return <span className="message-status sent"><FontAwesomeIcon icon={faCheck} /></span>;
            case 'delivered':
                return <span className="message-status delivered"><FontAwesomeIcon icon={faCheckDouble} /></span>;
            case 'read':
                return <span className="message-status read"><FontAwesomeIcon icon={faCheckDouble} /></span>;
            case 'failed':
                return <span className="message-status failed">Échec</span>;
            default:
                return null;
        }
    };

    const groupMessagesByDate = () => {
        const groups = [];
        let currentDate = null;
        let currentGroup = [];

        messages.forEach(message => {
            let messageDate;

            try {
                // Cas 1: message.createdAt est un objet Date
                if (message.createdAt instanceof Date) {
                    messageDate = message.createdAt;
                }
                // Cas 2: message.createdAt est un timestamp Firestore
                else if (message.createdAt && typeof message.createdAt.toDate === 'function') {
                    messageDate = message.createdAt.toDate();
                }
                // Cas 3: message.createdAt est un timestamp en millisecondes (nombre)
                else if (typeof message.createdAt === 'number') {
                    messageDate = new Date(message.createdAt);
                }
                // Cas 4: message.createdAt est une chaîne de caractères (comme "2 mai 2025 à 19:22:05 UTC+3")
                else if (typeof message.createdAt === 'string') {
                    messageDate = new Date(message.createdAt);

                    // Si la conversion échoue (date invalide), utiliser la date actuelle
                    if (isNaN(messageDate.getTime())) {
                        console.warn("Format de date non reconnu:", message.createdAt);
                        messageDate = new Date();
                    }
                }
                // Cas 5: message.createdAt est undefined ou autre chose
                else {
                    messageDate = new Date();
                }
            } catch (error) {
                console.error("Erreur lors de la conversion de la date:", error);
                messageDate = new Date();
            }

            const dateStr = format(messageDate, 'dd MMMM yyyy', { locale: fr });

            if (dateStr !== currentDate) {
                if (currentGroup.length > 0) {
                    groups.push({
                        date: currentDate,
                        messages: currentGroup
                    });
                }
                currentDate = dateStr;
                currentGroup = [message];
            } else {
                currentGroup.push(message);
            }
        });

        if (currentGroup.length > 0) {
            groups.push({
                date: currentDate,
                messages: currentGroup
            });
        }

        return groups;
    };

    return (
        <div className="chat-window">
            <div className="chat-header">
                <button className="back-button" onClick={onBack}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>

                <div className="interlocutor-info">
                    <img
                        src={interlocutor?.profilURL ?? IconAvatar}
                        alt={interlocutor?.displayName}
                        className="avatar"
                    />
                    <div className="user-details">
                        <h4>{interlocutor?.firstName} {interlocutor?.lastName}</h4>
                        {formatOnlineStatus(interlocutor?.isOnline)}
                    </div>
                </div>

                <div className="header-actions">
                    <button
                        className="options-button"
                        onClick={() => setShowOptions(!showOptions)}
                    >
                        <FontAwesomeIcon icon={faEllipsisV} />
                    </button>

                    {showOptions && (
                        <div className="options-menu">
                            <button>Voir le profil</button>
                            <button>Bloquer</button>
                            <button>Signaler</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="chat-messages">
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Chargement des messages...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="empty-chat">
                        <div className="empty-chat-icon">💬</div>
                        <p>Aucun message. Commencez la conversation!</p>
                    </div>
                ) : (
                    groupMessagesByDate().map((group, groupIndex) => (
                        <div key={groupIndex} className="message-group">
                            <div className="date-separator">
                                <span>{group.date}</span>
                            </div>

                            {group.messages.map((msg, index) => (
                                <div
                                    key={msg.id || index}
                                    className={`message-container ${msg.senderID !== currentUser?.uid ? 'sent' : 'received'}`}
                                >
                                    <div className="message">
                                        <p>{msg.text}</p>
                                        <div className="message-meta">
                                            <span className="time">
                                                {formatMessageTime(msg.createdAt)}
                                            </span>
                                            {renderMessageStatus(msg)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
                {showEmojiPicker && (
                    <div className="emoji-picker-container">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                )}

                <div className="chat-input">
                    <button
                        className="emoji-button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                        <FontAwesomeIcon icon={faSmile} />
                    </button>

                    <textarea
                        ref={textAreaRef}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Écrire un message..."
                        rows={1}
                    />

                    <button
                        className={`send-button ${newMessage.trim() ? 'active' : ''}`}
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                    >
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </div>
            </div>
        </div>
    );
}
