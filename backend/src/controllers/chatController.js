const { sendAnnouncerMessage, collectUserMessage, collectChatMessages } = require("../firebase/message");

const fetchUserMessages = async (req, res) => {
    const { userID } = req.params;
    try {
        const conversations = await collectUserMessage(userID);
        if (!conversations) {
            return res.status(404).json({
                success: false,
                message: "Erreur lors de la récupération des messages"
            });
        }
        res.status(200).json({
            success: true,
            message: "Récupération des messages réussie",
            conversations: conversations
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des messages:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur technique, réessayez plustard'
        });
    }
};

const sendMessage = async (req, res) => {
    const { conversationID } = req.params;
    const { senderID, receiverID, text } = req.body;

    try {
        const isMessageSent = await sendAnnouncerMessage(conversationID, senderID, receiverID, text);
        if (!isMessageSent) {
            return res.status(404).json({
                success: false,
                message: "Erreur lors de l'envoi du message"
            });
        };
        res.status(200).json({
            success: true,
            message: "Message envoyé avec succès"
        });
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur technique, réessayez plustard'
        });
    };
};

const fetchChatMessages = async (req, res) => {
    const { conversationID } = req.params;
    try {
        const messages = await collectChatMessages(conversationID);
        if (!messages) {
            return res.status(404).json({
                success: false,
                message: "Erreur lors de la récupération des messages"
            });
        }
        res.status(200).json({
            success: true,
            message: "Récupération des messages réussie",
            messages: messages
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des messages:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur technique, réessayez plustard'
        });
    }
};

module.exports = {
    fetchChatMessages,
    fetchUserMessages,
    sendMessage
};