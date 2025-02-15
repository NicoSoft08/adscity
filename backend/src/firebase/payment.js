const { PLAN_CONFIGS } = require("../config/constant");
const { firestore, admin } = require("../config/firebase-admin");

const collectAllPaymentsWithStatus = async () => {
    try {
        const paymentsSnapshot = await firestore.collection('PAYMENTS').get();
        const allPayments = [];
        const processingPayments = [];
        const completedPayments = [];
        const expiredPayments = [];

        paymentsSnapshot.forEach(doc => {
            const payments = { id: doc.id, ...doc.data() };
            allPayments.push(payments);

            if (payments.status === 'processing') {
                processingPayments.push(payments);
            } else if (payments.status === 'completed') {
                completedPayments.push(payments);
            } else if (payments.status === 'expired') {
                expiredPayments.push(payments);
            }
        });

        return { allPayments, processingPayments, completedPayments, expiredPayments };
    } catch (error) {
        console.error('Erreur lors de la récupération des paiements avec statut :', error);
        throw error;
    }
};

const collectPaymentProcess = async (userID, paymentData) => {
    try {
        const userRef = firestore.collection('USERS').doc(userID);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            console.log('Utilisateur non trouvé');
            return false;
        };

        const expiryDate = admin.firestore.Timestamp.fromDate(
            new Date(Date.now() + (15 * 60 * 1000)) // 15 minutes en millisecondes
        );
        const { displayName, email, profileNumber } = userDoc.data();
        const paymentCollection = firestore.collection('PAYMENTS');
        await paymentCollection.add({
            ...paymentData,
            displayName,
            email,
            profileNumber,
            userID,
            status: "processing", // "processing", "paid", "failed", "expired"
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            expireAt: expiryDate,
            paymentIntentId: paymentCollection.id,
        });
        return true;
    } catch (error) {
        console.error('Erreur lors du traitement du paiement :', error);
        return false;
    };
};

const collectPaymentByUserID = async (userID) => {
    try {
        const paymentRef = firestore.collection('PAYMENTS');
        const paymentQuery = paymentRef.where('userID', '==', userID);
        const paymentDoc = await paymentQuery.get();
        if (paymentDoc.empty) {
            return false;
        };

        const paymentData = paymentDoc.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return paymentData;
    } catch (error) {
        console.error('Erreur lors du traitement du paiement :', error);
        return false;
    };
};

const collectPayments = async () => {
    try {
        const paymentRef = firestore.collection('PAYMENTS');
        const paymentDoc = await paymentRef.get();
        if (paymentDoc.empty) {
            return false;
        };
        const paymentData = paymentDoc.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return paymentData;
    } catch (error) {
        console.error('Erreur lors du traitement du paiement :', error);
        return false;
    };
};

const upgradePaymentStatus = async (paymentID, status) => {
    if (!['processing', 'completed', 'failed'].includes(status)) {
        console.log('Statut de paiement invalide');
        return false;
    };

    try {
        const paymentRef = firestore.collection('PAYMENTS').doc(paymentID);
        const paymentDoc = await paymentRef.get();
        if (!paymentDoc.exists) {
            return false;
        };

        const { plan, userID } = paymentDoc.data();

        await paymentRef.update({
            status,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        if (status === 'completed') {
            const userRef = firestore.collection('USERS').doc(userID);
            const planConfig = PLAN_CONFIGS[plan] || {};
            const startDate = admin.firestore.FieldValue.serverTimestamp();
            const endDate = admin.firestore.Timestamp.fromDate(
                new Date(Date.now() + (30 * 24 * 60 * 60 * 1000))
            );

            await userRef.update({
                plans: {
                    [plan]: planConfig,
                    subscriptionDate: startDate,
                    expiryDate: endDate,
                }
            });
        };
        return true;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut de paiement :', error);
        return false;
    };
};

const collectProcessingPayments = async () => {
    try {
        const paymentRef = firestore.collection('PAYMENTS');
        const paymentQuery = paymentRef.where('status', '==', 'processing');
        const paymentDoc = await paymentQuery.get();
        if (paymentDoc.empty) {
            return [];
        };
        const processingPayments = paymentDoc.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return processingPayments;
    } catch (error) {
        console.error('Erreur lors de la récupération des paiements en cours :', error);
        return false;
    };
};

const collectCompletedPayments = async () => {
    try {
        const paymentRef = firestore.collection('PAYMENTS');
        const paymentQuery = paymentRef.where('status', '==', 'completed');
        const paymentDoc = await paymentQuery.get();
        if (paymentDoc.empty) {
            return false;
        };
        const completedPayments = paymentDoc.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return completedPayments;
    } catch (error) {
        console.error('Erreur lors de la récupération des paiements terminés :', error);
        return false;
    };
};

const collectFailedPayments = async () => {
    try {
        const paymentRef = firestore.collection('PAYMENTS');
        const paymentQuery = paymentRef.where('status', '==', 'failed');
        const paymentDoc = await paymentQuery.get();
        if (paymentDoc.empty) {
            return false;
        };
        const failedPayments = paymentDoc.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return failedPayments;
    } catch (error) {
        console.error('Erreur lors de la récupération des paiements échoués :', error);
        return false;
    };
};


module.exports = {
    collectAllPaymentsWithStatus,
    collectCompletedPayments,
    collectFailedPayments,
    collectPaymentByUserID,
    collectPaymentProcess,
    collectPayments,
    collectProcessingPayments,
    upgradePaymentStatus,
};