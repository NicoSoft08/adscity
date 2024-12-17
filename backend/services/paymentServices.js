const express = require('express');
const router = express.Router();
const { admin } = require("../config/firebase-admin");
const { PLAN_CONFIGS } = require('../config/constant');

// Route pour stocker les informations de paiement d'un utilisateur
router.post('/process', async (req, res) => {
    const { userID, paymentData } = req.body;

    try {
        console.log('Payment Data Processed:', paymentData);

        // Vérifier si l'utilisateur existe déjà
        const userRef = admin.firestore().collection('USERS').doc(userID);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                error: 'Utilisateur non trouvé'
            });
        };

        const { displayName, email, profileNumber } = userDoc.data();

        // Créer une collection pour stocker les informations de paiement
        const paymentCollection = admin.firestore().collection('PAYMENTS');

        await paymentCollection.add({
            ...paymentData,
            displayName,
            email,
            profileNumber,
            userID,
            status: 'processing', // Options: 'processing', 'completed', 'failed'
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });



        res.status(200).json({
            success: true,
            message: 'Paiement initié avec succès'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors du traitement du paiement',
            message: error.message
        });
    }
});

// Route pour récupérer les informations de paiement d'un utilisateur
router.get('/collect/:userID', async (req, res) => {
    const { userID } = req.params;

    if (!userID) {
        return res.status(400).json({
            success: false,
            error: 'ID de l\'utilisateur manquant'
        });
    }

    try {
        const paymentRef = admin.firestore().collection('PAYMENTS');
        const paymentDoc = await paymentRef.where('userID', '==', userID).get();
        if (paymentDoc.empty) {
            return res.status(404).json({
                success: false,
                error: 'Aucune information de paiement trouvée pour cet utilisateur'
            });
        };
        const paymentData = paymentDoc.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json({
            success: true,
            paymentData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des informations de paiement',
            message: error.message
        });

    }
})

// Route pour récupérer les informations de paiement des utilisateurs
router.get('/collect/all', async (req, res) => {
    try {
        const paymentRef = admin.firestore().collection('PAYMENTS');
        const paymentDoc = await paymentRef.get();

        if (paymentDoc.empty) {
            return res.status(404).json({
                success: false,
                error: 'Aucune information de paiement trouvée'
            });
        };

        const paymentData = paymentDoc.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json({
            success: true,
            paymentData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des informations de paiement'
        });

    }
});


// Route pour mettre à jour le statut de paiement
router.put('/update/status/:paymentID', async (req, res) => {
    const { paymentID } = req.params;
    const { status } = req.body;

    if (!['processing', 'completed', 'failed'].includes(status)) {
        return res.status(400).json({
            success: false,
            error: 'Statut de paiement invalide'
        });
    }

    try {
        const paymentRef = admin.firestore().collection('PAYMENTS').doc(paymentID);
        const paymentDoc = await paymentRef.get();

        if (!paymentDoc.exists) {
            return res.status(404).json({
                success: false,
                error: 'Paiement non trouvé'
            });
        }

        const { plan, userID } = paymentDoc.data();

        await paymentRef.update({
            status,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        if (status === 'completed') {
            const userRef = admin.firestore().collection('USERS').doc(userID);
            const planConfig = PLAN_CONFIGS[plan] || {};
            const startDate = admin.firestore.FieldValue.serverTimestamp();
            const endDate = admin.firestore.Timestamp.fromDate(
                new Date(Date.now() + (30 * 24 * 60 * 60 * 1000))
            );

            await userRef.update({
                plans: {
                    [plan]: planConfig,
                    startAt: startDate,
                    endAt: endDate,
                }
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Statut de paiement mis à jour avec succès'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la mise à jour du statut de paiement'
        });
    };
});


// Route pour collecter les paiements en cours
router.get('/processing', async (req, res) => {
    try {
        const paymentRef = admin.firestore().collection('PAYMENTS');
        const paymentDoc = await paymentRef
            .where('status', '==', 'processing')
            .get();
        if (paymentDoc.empty) {
            return res.status(404).json({
                success: false,
                error: 'Aucun paiement en cours trouvé'
            });
        }
        const processingPayments = paymentDoc.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json({
            success: true,
            paymentData: processingPayments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des paiements en cours',
        });
    }
});


// Route pour collecter les paiements réussis
router.get('/completed', async (req, res) => {
    try {
        const paymentRef = admin.firestore().collection('PAYMENTS');
        const paymentDoc = await paymentRef
            .where('status', '==', 'completed')
            .get();
        if (paymentDoc.empty) {
            return res.status(404).json({
                success: false,
                error: 'Aucun paiement réussi trouvé'
            });
        }
        const completedPayments = paymentDoc.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json({
            success: true,
            paymentData: completedPayments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des paiements réussis',
        });
    }
});


// Route pour collecter les paiements échoués
router.get('/failed', async (req, res) => {
    try {
        const paymentRef = admin.firestore().collection('PAYMENTS');
        const paymentDoc = await paymentRef
            .where('status', '==', 'failed')
            .get();
        if (paymentDoc.empty) {
            return res.status(404).json({
                success: false,
                error: 'Aucun paiement échoué trouvé'
            });
        }
        const failedPayments = paymentDoc.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json({
            success: true,
            paymentData: failedPayments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des paiements échoués',
        });
    }
});




module.exports = router;
