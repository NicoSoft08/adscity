import React, { useEffect, useState } from 'react';
import { formatTimeDistance } from '../../func';
import { IconAvatar } from '../../config/images';
import { fetchDataByUserID } from '../../routes/userRoutes';
import { markConversationAsRead } from '../../routes/chatRoutes';
import '../../styles/ConversationList.scss';
import Loading from '../../customs/Loading';

const ConversationItem = ({ conversation, onSelectChat, currentUser }) => {
    const [interlocutor, setInterlocutor] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser || !conversation || !conversation.participants) return;

            const userID = currentUser.uid;
            const interlocutorID = conversation.participants.find(id => id !== userID); // 🔹 Trouve l'autre participant

            const result = await fetchDataByUserID(interlocutorID);
            if (result.success) {
                setInterlocutor(result.data);
                setLoading(false);
            }
        };

        fetchData();
    }, [conversation, currentUser]);

    // Vérifier si le message est non lu
    const userID = currentUser?.uid;
    const unreadCount = conversation.unreadCount?.[userID] || 0;
    const isUnread = unreadCount > 0;

    // Fonction pour gérer le clic sur la conversation
    const handleSelectChat = async () => {
        const idToken = await currentUser.getIdToken();
        // Si la conversation contient des messages non lus, marquer comme lus
        if (isUnread && conversation.id) {
            markConversationAsRead(conversation?.id, userID, idToken);
        }

        // Appeler la fonction onSelectChat passée en props
        onSelectChat(conversation);
    };

    return (
        <div className={`conversation-item ${isUnread ? 'unread' : ''}`} onClick={handleSelectChat}>
            {loading && <Loading />}
            <div className="avatar-container">
                <img src={interlocutor?.profilURL ?? IconAvatar} alt={interlocutor?.displayName} className="profile-image" />
                {interlocutor?.isOnline && <div className="online-indicator" />}
            </div>
            <div className="conversation-info">
                <div className="conversation-header">
                    <h4 className={isUnread ? 'unread-text' : ''}>
                        {interlocutor?.firstName} {interlocutor?.lastName}
                    </h4>
                    <span className={`conversation-date ${isUnread ? 'unread' : ''}`}>
                        {formatTimeDistance(conversation.updatedAt)}
                    </span>
                </div>
                <div className="message-preview">
                    <p className={`last-message ${isUnread ? 'unread-text' : ''}`}>
                        {conversation.lastMessage}
                    </p>

                    {isUnread && (
                        <div className="unread-badge">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function ConversationList({ conversations, onSelectChat, currentUser }) {
    return (
        <div className="conversation-list">
            <h2>Messages</h2>
            {conversations && conversations?.length === 0 ? (
                <p>Aucune conversation</p>
            ) : (
                conversations?.map((conv) => (
                    <ConversationItem
                        key={conv.id}
                        conversation={conv}
                        onSelectChat={onSelectChat}
                        currentUser={currentUser}
                    />
                ))
            )}
        </div>
    );
};
