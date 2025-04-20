const express = require('express');

// Importation des controleurs
const { 
    createPost, 
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
    suspendPost,
    markPostAsSold,
    fetchNearbyPosts,
    getDataFromPostID,
    getPosts,
    adminDeletePost,
    adminRefusePost,
    adminApprovePost,
    adminSuspendPost,
    deletePost
} = require('../controllers/postController');
const { verifyToken } = require('../middlewares/authMiddleware');
// const { collectPostBySlug } = require('../firebase/post');

const router = express.Router();

router.get('/', getPosts);

router.post('/create', verifyToken, createPost);

router.post('/post/:postID/admin/approve', adminApprovePost);
router.post('/post/:postID/admin/refuse', adminRefusePost);
router.delete('/post/:postID/admin/delete', adminDeletePost);
router.post('/post/:postID/admin/suspend', adminSuspendPost);
router.post('/post/:postID/report', reportPostByID)

router.get('/all', getPostsData);
router.get('/pending', getPendingPosts);
router.get('/approved', getApprovedPosts);
router.get('/refused', getRefusedPosts);

router.get('/post/:postID', getPostByID);
router.get('/:post_id', getDataFromPostID);
// router.get('/:category/:subcategory/:slug', collectPostBySlug);
router.get('/user/:userID', verifyToken, getPostsByUserID);

router.get('/user/:userID/pending', getPendingPostsByUserID);
router.get('/user/:userID/approved', getApprovedPostsByUserID);
router.get('/user/:userID/refused', getRefusedPostsByUserID);
router.get('/user/:UserID/active', getActivePostsByUserID);
router.get('/user/:userID/outdated', getOutdatedPostsByUserID);

router.post('/category', getPostsByCategoryName);
router.post('/related-category', getRelatedPosts);

router.put('/:postID/update', updatePost);
router.delete('/:postID/delete', deletePost);
router.post('/:postID/mark/sold', markPostAsSold);

router.get('/collect/nearby', fetchNearbyPosts);


module.exports = router;