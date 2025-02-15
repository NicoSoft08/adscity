const { firestore, admin } = require("../config/firebase-admin");

const collectUserMessage = async (userID) => {
    try {
        // Récupérer les messages où l'utilisateur est soit l'expéditeur, soit le destinataire
        const conversationsRef = firestore.collection('CONVERSATIONS')
            .where('participants', 'array-contains', userID)
            .orderBy('updatedAt', 'desc');

        const conversationsSnap = await conversationsRef.get();
        const conversations = conversationsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return conversations;
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des messages :", error);
        return [];
    };
};

const sendAnnouncerMessage = async (conversationID, senderID, receiverID, text) => {
    if (!senderID || !receiverID || !text.trim()) {
        console.error("❌ Données invalides : senderID, receiverID et text sont requis.");
        return false;
    }

    const participants = [senderID, receiverID].sort();

    try {
        const conversationRef = firestore.collection('CONVERSATIONS').doc(conversationID);
        const conversationSnap = await conversationRef.get();

        if (!conversationSnap.exists) {
            // 🔹 Créer la conversation si elle n'existe pas
            await conversationRef.set({
                participants,
                lastMessage: text,
                updatedAt: new Date(),
            });
        } else {
            // 🔹 Mettre à jour la conversation existante
            await conversationRef.update({
                lastMessage: text,
                updatedAt: new Date(),
            });
        }

        // 🔹 Ajouter le message à la collection des messages avec `add()` au lieu de `doc().set()`
        await conversationRef.collection('MESSAGES').add({
            senderID,
            receiverID,
            text,
            status: "sent",
            createdAt: new Date(),
        });

        return true;
    } catch (error) {
        console.error("❌ Erreur lors de l'envoi du message :", error);
        throw new Error("Erreur interne lors de l'envoi du message."); // 🔹 Lever une erreur explicite
    }
};


const collectChatMessages = async (conversationID) => {
    try {
        // 🔹 Vérifier si la conversation existe
        const conversationRef = firestore.collection('CONVERSATIONS').doc(conversationID);
        const conversationSnap = await conversationRef.get();

        if (!conversationSnap.exists) {
            console.error("❌ Conversation introuvable.");
            return false;
        }

        // 🔹 Récupérer les messages de la conversation
        const messagesRef = conversationRef.collection('MESSAGES').orderBy('createdAt', 'asc');
        const messagesSnap = await messagesRef.get();

        const messages = messagesSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return messages;
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des messages :", error);
        return false;
    }
};

module.exports = {
    collectChatMessages,
    collectUserMessage,
    sendAnnouncerMessage,
}