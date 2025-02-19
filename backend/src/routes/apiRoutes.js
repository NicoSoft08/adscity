const express = require('express');

// Importation des controleurs
const { 
    searchItems, 
    manageInteraction, 
    manageContactClick, 
    contactSupportClient, 
    getPostsLocations, 
    advancedSearch, 
    rateUser,
    updateUserSocialLinks,
    incrementViewCount,
    incrementClickCount,
    fetchFilteredPosts,
    hostAdvertising,
    fetchPubs,
    fetchPubById
} = require('../controllers/apiController');

const router = express.Router();

router.get('/search/items', searchItems);
router.post('/update/interaction', manageInteraction);
router.post('/update/contact-click', manageContactClick);
router.post('/contact/support-client', contactSupportClient);
router.get('/collect/locations', getPostsLocations);
router.get('/search/advanced', advancedSearch);
router.post('/rate/:userID', rateUser);
router.post('/update/:userID/social-links', updateUserSocialLinks);
router.post('/increment/view/:postID', incrementViewCount);
router.post('/increment/click/:postID', incrementClickCount);
router.get('/search/filtered', fetchFilteredPosts);
router.post('/host/pub', hostAdvertising);
router.get('/collect/pub', fetchPubs);
router.get('/collect/pub/:pub_id', fetchPubById);

module.exports = router;