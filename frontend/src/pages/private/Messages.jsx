import React, { useContext, useEffect, useState } from 'react';
import { fetchUserConversations } from '../../routes/chatRoutes';
import { fetchDataByUserID } from '../../routes/userRoutes';
import ConversationList from '../../components/messages/ConversationList';
import ChatWindow from '../../components/messages/ChatWindow';
import { AuthContext } from '../../contexts/AuthContext';
import Loading from '../../customs/Loading';

export default function Messages() {
    const { currentUser } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [interlocutor, setInterlocutor] = useState(null);
    const [loading, setLoading] = useState(false);

    // 📌 Récupérer les conversations de l'utilisateur
    useEffect(() => {
        const fetchMessages = async () => {
            if (!currentUser) return;
            try {
                const userID = currentUser?.uid;
                const idToken = await currentUser.getIdToken();
                const result = await fetchUserConversations(userID, idToken);
                if (result.success) {
                    setConversations(result.data.conversations || []);
                    setLoading(false);
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
            if (selectedChat && selectedChat.participants) {
                const userID = currentUser.uid;
                const participants = selectedChat.participants || [];
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
    }, [selectedChat, currentUser]);

    return (
        <div className="messages-container" style={{ marginTop: '150px' }}>
            {loading && <Loading />}
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
