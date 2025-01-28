const express = require('express');

// Importation des controleurs
const { 
    searchItems, 
    manageInteraction, 
    manageContactClick, 
    contactSupportClient, 
    getPostsLocations, 
    advancedSearch, 
    rateUser
} = require('../controllers/apiController');

const router = express.Router();

router.get('/search/items', searchItems);
router.post('/update/interaction', manageInteraction);
router.post('/update/contact-click', manageContactClick);
router.post('/contact/support-client', contactSupportClient);
router.get('/collect/locations', getPostsLocations);
router.get('/search/advanced', advancedSearch);
router.post('/rate/:userID', rateUser);

module.exports = router;