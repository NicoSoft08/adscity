import React, { useEffect, useState } from 'react';
import { fetchUserConversations } from '../../routes/chatRoutes';
import { fetchDataByUserID } from '../../routes/userRoutes';
import ConversationList from '../../components/messages/ConversationList';
import ChatWindow from '../../components/messages/ChatWindow';

export default function Messages({ currentUser }) {
    const [conversations, setConversations] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [interlocutor, setInterlocutor] = useState(null);
    const [loading, setLoading] = useState(true);

    // 📌 Récupérer les conversations de l'utilisateur
    useEffect(() => {
        const fetchMessages = async () => {
            if (!currentUser) return;
            setLoading(true);
            try {
                const userID = currentUser?.uid;
                const result = await fetchUserConversations(userID);
                if (result.success) {
                    setConversations(result.conversations);
                }
            } catch (error) {
                console.error("❌ Erreur lors de la récupération des conversations :", error);
            }
            setLoading(false);
        };

        fetchMessages();
    }, [currentUser]);

    // 📌 Récupérer les infos de l’interlocuteur
    useEffect(() => {
        if (!selectedChat || !currentUser) return;

        const fetchInterlocutor = async () => {
            const userID = currentUser.uid;
            const participants = selectedChat.participants || [];
            const interlocutorID = participants.find(participant => participant !== userID);

            try {
                const result = await fetchDataByUserID(interlocutorID);
                if (result.success) {
                    setInterlocutor(result.data);
                } else {
                    setInterlocutor(null);
                }
            } catch (error) {
                console.error("❌ Erreur lors de la récupération de l'interlocuteur :", error);
                setInterlocutor(null);
            }
        };

        fetchInterlocutor();
    }, [selectedChat, currentUser]);

    return (
        <div className="messages-container">
            {selectedChat ? (
                <ChatWindow
                    chat={selectedChat}
                    currentUser={currentUser}
                    interlocutor={interlocutor}
                    onBack={() => setSelectedChat(null)} // 🔹 Gérer le retour
                />
            ) : (
                <ConversationList
                    currentUser={currentUser}
                    conversations={conversations}
                    onSelectChat={setSelectedChat}
                />
            )}
        </div>
    );
};
