import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { fetchUserConversations } from '../routes/chatRoutes';
import { IconAvatar } from '../config/images';
import '../styles/MessagesList.scss';

export default function MessagesList({ onSelectConversation, adData, sellerData }) {
    const [conversations, setConversations] = useState([]);
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!currentUser) return;
            try {
                const userID = currentUser.uid;
                const idToken = await currentUser.getIdToken();
                const result = await fetchUserConversations(userID, idToken);
                if (result.success) {
                    setConversations(result.data.conversations || []);
                }
            } catch (error) {
                console.error("❌ Erreur lors de la récupération des conversations :", error);
            }
        };

        fetchMessages();
    }, [currentUser]);

    const formatMessageTime = (timestamp) => {
        if (!timestamp?._seconds) return '';
        return new Date(timestamp._seconds * 1000).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatOnlineStatus = (isOnline) => (
        <span className={`status ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? 'En ligne' : 'Hors ligne'}
        </span>
    );

    if (conversations.length === 0) {
        return <div className="no-messages">Aucune conversation</div>;
    }

    return (
        <div className="messages-list">
            {conversations.map(convo => (
                <div
                    key={convo.id}
                    className="conversation-item"
                    onClick={() => onSelectConversation(convo)}
                >
                    <div className="avatar-section">
                        <img src={sellerData?.profileURL || IconAvatar} alt="avatar" className="profile" />
                        <img src={adData?.images?.[0]} alt="ad" className="thumbnail" />
                    </div>

                    <div className="info-section">
                        <div className="top-row">
                            <h4 className="name">{sellerData?.firstName} {sellerData?.lastName} {formatOnlineStatus(sellerData?.isOnline)}</h4>
                        </div>
                        <div className="top-row">
                            <p className="ad-title">{adData?.details?.title}</p>
                            <p className="ad-price">{adData?.details?.price} ₽</p>
                        </div>
                        <div className="top-row">
                            <p className="last-message">{convo.lastMessage}</p>
                            <span className="message-time">{formatMessageTime(convo.createdAt)}</span>
                        </div>
                    </div>

                    {convo.unreadCount > 0 && (
                        <div className="unread-count">{convo.unreadCount}</div>
                    )}
                </div>
            ))}
        </div>
    );
}
