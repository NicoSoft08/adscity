const express = require('express');

// Importation des controleurs
const { 
    getPayments, 
    getPaymentByUserID, 
    updatePaymentStatus, 
    getProcessingPayments, 
    getCompletedPayments, 
    getFailedPayments, 
    createPaymentIntent,
    getPaymentStatus
} = require('../controllers/paymentController');

const router = express.Router();

router.post('/create-intent', createPaymentIntent);
router.get('/collect/:userID', getPaymentByUserID);
router.get('/all', getPayments);
router.get('/all/status', getPaymentStatus);
router.put('/update-status/:paymentID', updatePaymentStatus);
router.get('/processing', getProcessingPayments);
router.get('/completed', getCompletedPayments);
router.get('/failed', getFailedPayments);

module.exports = router;