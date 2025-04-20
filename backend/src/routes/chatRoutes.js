const express = require('express');

// Importation des controleurs
const { sendMessage, fetchUserMessages, fetchChatMessages } = require('../controllers/chatController');

const router = express.Router();

router.get('/user/:userID', fetchUserMessages);
router.post('/:conversationID/send', sendMessage);
router.get('/:conversationID/messages', fetchChatMessages);

module.exports = router;