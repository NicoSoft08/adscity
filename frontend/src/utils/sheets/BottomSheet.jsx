import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowUpRightFromSquare, faCheck, faCheckDouble, faChevronDown, faPaperPlane, faSmile } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../../customs/Spinner';
import MessagesList from '../MessagesList';
import { IconAvatar } from '../../config/images';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import '../../styles/BottomSheet.scss';
import { sendMessage } from '../../routes/chatRoutes';
import Toast from '../../customs/Toast';
import { fetchProfileByUserID } from '../../routes/storageRoutes';

const predefinedMessages = [
    "Bonjour, votre annonce m'intéresse. Est-elle toujours disponible ?",
    "Pouvez-vous me donner plus de détails sur l'annonce ?",
    "Est-il possible de négocier le prix ?",
    "Où et quand puis-je voir l'article en personne ?",
];

export default function BottomSheet({
    isOpen,
    onClose,
    adData,
    sellerData,
    unreadMessagesCount = 0
}) {
    const textAreaRef = useRef(null);
    const messagesEndRef = useRef(null);
    const [view, setView] = useState('compose'); // 'compose' ou 'messages'
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [profilURL, setProfilURL] = useState(null);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        const fetchProfilURL = async () => {
            try {
                const userID = sellerData.userID;
                const response = await fetchProfileByUserID(userID);
                if (response && response.profilURL) {
                    setProfilURL(response.profilURL);
                } else {
                    setProfilURL(null); // Assurer que la valeur est bien gérée
                }
            } catch (error) {
                setProfilURL(null);
                throw error;
            }
        };

        if (sellerData.userID) {
            fetchProfilURL();
        }
    }, [sellerData?.userID]);

    // Réinitialiser la vue lorsque le bottom sheet s'ouvre
    useEffect(() => {
        if (isOpen) {
            setView('compose');
            setMessage('');
        }
    }, [isOpen]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };


    const handleSendMessage = async () => {
        if (!currentUser) {
            setToast({ show: true, type: 'error', message: 'Vous devez être connecté pour envoyer un message.' });
            return;
        }
        setLoading(true);

        try {
            const senderID = currentUser.uid;
            const receiverID = adData?.userID;
            const message = newMessage;
            const idToken = await currentUser.getIdToken();

            const result = await sendMessage(senderID, receiverID, idToken, message);
            if (result.success) {
                setToast({ show: true, type: 'info', message: result.message });
                setNewMessage('');
                setLoading(false);
            } else {
                setToast({ show: true, type: 'error', message: result.message });
                setLoading(false);
                setNewMessage('');
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message :', error);
            setToast({ show: true, type: 'error', message: 'Une erreur est survenue lors de l\'envoi du message.' });

        }

    };

    const openInMessenger = () => { }

    if (!isOpen) return null;

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

    const profileImage = profilURL ?? IconAvatar;

    return (
        <div className="bottom-sheet-overlay" onClick={onClose}>
            <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
                {view === 'compose' ? (
                    <>
                        {/* Header pour la vue de composition */}
                        <div className="bottom-sheet-header">
                            <button
                                className="back-button"
                                onClick={() => setView('messages')}
                            >
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </button>

                            <div className="seller-info">
                                <div className="seller-avatar">
                                    <img className='profile' src={profileImage} alt={sellerData.displayName} />
                                    <div className="ad-thumbnail">
                                        <img src={adData.images[0]} alt={adData.title} />
                                    </div>
                                </div>
                                <div className="ad-info">
                                    <h4>{sellerData.firstName} {sellerData.lastName}</h4>
                                    <div>
                                        <p className="ad-title">{adData?.details.title}</p>
                                        <p className="ad-price">{adData?.details.price} ₽</p>
                                    </div>
                                </div>
                            </div>

                            <div className="header-actions">
                                <button className="messenger-button" onClick={openInMessenger}>
                                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                                </button>
                                <button className="close-button" onClick={onClose}>
                                    <FontAwesomeIcon icon={faChevronDown} />
                                </button>
                            </div>
                        </div>

                        {/* Formulaire de message */}
                        <div className="bottom-sheet-content">
                            <div className="message-form">


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
                                                        className={`message-container ${msg.senderID === currentUser.uid ? 'sent' : msg.senderID === 'system' ? 'system' : 'received'}`}
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
                                    <div className="predefined-messages">
                                        {predefinedMessages.map((msg, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setNewMessage(msg);
                                                    // Focus sur le textarea après avoir sélectionné un message prédéfini
                                                    if (textAreaRef.current) {
                                                        textAreaRef.current.focus();
                                                    }
                                                }}
                                                className={newMessage === msg ? 'selected' : ''}
                                            >
                                                {msg}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="chat-input">
                                        <textarea
                                            ref={textAreaRef}
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Écrire un message..."
                                            rows={1}
                                            aria-label="Champ de message"
                                            id="message-input"
                                        />
                                        <button
                                            className={`send-button ${newMessage.trim() ? 'active' : ''}`}
                                            onClick={handleSendMessage}
                                            disabled={loading || !newMessage.trim()}
                                            aria-label="Envoyer le message"
                                            aria-disabled={loading || !newMessage.trim()}
                                        >
                                            {loading ? <Spinner /> : <FontAwesomeIcon icon={faPaperPlane} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Header pour la vue des messages */}
                        <div className="bottom-sheet-header">
                            <div className="messages-title">
                                <h3>Messages</h3>
                                {unreadMessagesCount > 0 && (
                                    <span className="unread-badge">{unreadMessagesCount}</span>
                                )}
                            </div>

                            <div className="header-actions">
                                <button className="messenger-button" onClick={openInMessenger}>
                                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                                </button>
                                <button className="close-button" onClick={onClose}>
                                    <FontAwesomeIcon icon={faChevronDown} />
                                </button>
                            </div>
                        </div>

                        {/* Liste des conversations */}
                        <div className="bottom-sheet-content">
                            <MessagesList
                                adData={adData}
                                sellerData={sellerData}
                                messages={messages}
                                onSelectConversation={(conversation) => {
                                    // Logique pour sélectionner une conversation
                                    // et passer à la vue de composition
                                    setView('compose');
                                }}
                            />
                        </div>
                    </>
                )}
            </div>

            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
};
