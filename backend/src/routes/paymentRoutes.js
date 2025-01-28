const express = require('express');

// Importation des controleurs
const { 
    getPaymentProcess, 
    getPayments, 
    getPaymentByUserID, 
    updatePaymentStatus, 
    getProcessingPayments, 
    getCompletedPayments, 
    getFailedPayments 
} = require('../controllers/paymentController');

const router = express.Router();

router.post('/process', getPaymentProcess);
router.get('/:userID', getPaymentByUserID);
router.get('/all', getPayments);
router.put('/update-status/:paymentID', updatePaymentStatus);
router.get('/processing', getProcessingPayments);
router.get('/completed', getCompletedPayments);
router.get('/failed', getFailedPayments);

module.exports = router;