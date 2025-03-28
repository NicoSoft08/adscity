const express = require('express');

// Importation des controleurs
const { 
    createPost, 
    approvePost, 
    refusePost, 
    getPostsData, 
    getPendingPosts, 
    getApprovedPosts, 
    getRefusedPosts, 
    getPostByID, 
    getPostsByUserID, 
    getPendingPostsByUserID, 
    getApprovedPostsByUserID, 
    getRefusedPostsByUserID, 
    getActivePostsByUserID, 
    getOutdatedPostsByUserID, 
    getPostsByCategoryName, 
    getRelatedPosts, 
    reportPostByID,
    updatePost,
    deletePost,
    suspendPost,
    markPostAsSold,
    fetchNearbyPosts,
    getDataFromPostID,
    getPosts
} = require('../controllers/postController');
// const { collectPostBySlug } = require('../firebase/post');

const router = express.Router();

router.get('/', getPosts);

router.post('/create', createPost);

router.post('/post/:postID/approve', approvePost);
router.post('/post/:postID/refuse', refusePost);
router.post('/post/:postID/report', reportPostByID)

router.get('/all', getPostsData);
router.get('/pending', getPendingPosts);
router.get('/approved', getApprovedPosts);
router.get('/refused', getRefusedPosts);

router.get('/post/:postID', getPostByID);
router.get('/:post_id', getDataFromPostID);
// router.get('/:category/:subcategory/:slug', collectPostBySlug);
router.get('/user/:userID', getPostsByUserID);

router.get('/user/:userID/pending', getPendingPostsByUserID);
router.get('/user/:userID/approved', getApprovedPostsByUserID);
router.get('/user/:userID/refused', getRefusedPostsByUserID);
router.get('/user/:UserID/active', getActivePostsByUserID);
router.get('/user/:userID/outdated', getOutdatedPostsByUserID);

router.post('/category', getPostsByCategoryName);
router.post('/related-category', getRelatedPosts);

router.put('/:postID/update', updatePost);
router.delete('/:postID/delete', deletePost);
router.post('/:postID/suspend', suspendPost);
router.post('/:PostID/mark/sold', markPostAsSold);

router.get('/collect/nearby', fetchNearbyPosts);


module.exports = router;