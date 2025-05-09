
const backendUrl = process.env.REACT_APP_BACKEND_URL;

    
const sendMessage = async (senderID, receiverID, idToken, text) => {
    try {
        const response = await fetch(`${backendUrl}/api/conversations/message/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({ senderID, receiverID, text })
        });

        const result = await response.json();
        console.log('Message envoyé avec succès:', result);
        return result;
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message', error);
        throw error;
    }
};

const fetchUserConversations = async (userID, idToken) => {
    try {
        const response = await fetch(`${backendUrl}/api/conversations/user/${userID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la récupération des messages:', error);
        throw error;
    }
};

const markConversationAsRead = async (conversationID, userID, idToken) => {
    try {
        const response = await fetch(`${backendUrl}/api/conversations/${conversationID}/read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({ userID }),
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la conversation:', error);
        throw error;
    }
}

const fetchUserChat = async (senderID, receiverID) => {
    const participants = [senderID, receiverID].sort();
    const conversationID = participants.join('_');
    try {
        const response = await fetch(`${backendUrl}/api/conversations/${conversationID}/messages`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur de collecte des messages', error);
        throw error;
    }
};

const fetchChatMessages = async (chatID) => {
    try {
        const response = await fetch(`${backendUrl}/api/conversations/${chatID}/messages`, {
            method: 'GET', // 🔹 Correction : Doit être un GET
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('❌ Erreur de collecte des messages', error);
        throw error;
    }
};

export {
    fetchUserConversations,
    fetchUserChat,
    fetchChatMessages,
    sendMessage,
    markConversationAsRead,
}