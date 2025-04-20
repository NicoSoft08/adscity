import React, { useEffect, useState } from 'react';
import { formatTimeDistance } from '../../func';
import { IconAvatar } from '../../config/images';
import { fetchDataByUserID } from '../../routes/userRoutes';
import '../../styles/ConversationList.scss';

const ConversationItem = ({ conversation, onSelectChat, currentUser }) => {
    const [interlocutor, setInterlocutor] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser || !conversation || !conversation.participants) return;

            const userID = currentUser.uid;
            const interlocutorID = conversation.participants.find(id => id !== userID); // 🔹 Trouve l'autre participant

            const result = await fetchDataByUserID(interlocutorID);
            if (result.success) {
                setInterlocutor(result.data);
            }
        };

        fetchData();
    }, [conversation, currentUser]);


    // Déterminer l'image de profil à afficher
    const profileImage = interlocutor?.profilURL ?? IconAvatar;

    return (
        <div className="conversation-item" onClick={() => onSelectChat(conversation)}>
            <img src={profileImage} alt={interlocutor.displayName} />
            <div className="conversation-info">
                <div className="conversation-header">
                    <h4>{interlocutor.displayName || 'Utilisateur'}</h4>
                    <span className="conversation-date">
                        {formatTimeDistance(conversation.updatedAt)}
                    </span>
                </div>
                <p className="last-message">
                    {conversation.lastMessage}
                </p>
            </div>
        </div>
    );
};

export default function ConversationList({ conversations, onSelectChat, currentUser }) {
    return (
        <div className="conversation-list">
            <h2>Messages</h2>
            {conversations.length === 0 ? (
                <p>Aucune conversation</p>
            ) : (
                conversations.map((conv) => (
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
