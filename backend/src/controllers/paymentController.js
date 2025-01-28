const { collectPaymentProcess, collectPaymentByUserID, collectPayments, upgradePaymentStatus, collectProcessingPayments, collectCompletedPayments, collectFailedPayments } = require("../firebase/payment");

const getPaymentProcess = async (req, res) => {
    const { userID, paymentData } = req.body;

    try {
        const paymentResult = await collectPaymentProcess(userID, paymentData);
        if (!paymentResult) {
            return res.status(400).json({
                success: false,
                message: 'Erreur lors du traitement du paiement'
            });
        };
        res.status(200).json({
            success: true,
            message: 'Paiement initié avec succès'
        });
    } catch (error) {
        console.error('Erreur lors du traitement du paiement :', error);
        res.status(500).json({
            success: false,
            message: 'Erreur technique, réessayer plus tard'
        });
    };
};

const getPaymentByUserID = async (req, res) => {
    const { userID } = req.params;

    try {
        const paymentData = await collectPaymentByUserID(userID);
        if (!paymentData) {
            return res.status(404).json({
                success: false,
                message: 'Aucun paiement trouvé pour cet utilisateur'
            });
        };
        res.status(200).json({
            success: true,
            message: 'Paiements récupérés avec succès',
            paymentData: paymentData
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des paiements :', error);
       res.status(500).json({
            success: false,
            message: 'Erreur technique, réessayer plus tard'
        });
    };
};

const getPayments = async (req, res) => {
    try {
        const paymentData = await collectPayments();
        if (!paymentData) {
            return res.status(404).json({
                success: false,
                message: 'Aucun paiement trouvé'
            });
        };
        res.status(200).json({
            success: true,
            message: 'Paiements récupérés avec succès',
            paymentData: paymentData
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des paiements :', error);
        res.status(500).json({
            success: false,
            message: 'Erreur technique, réessayer plus tard'
        });
    };
};

const updatePaymentStatus = async (req, res) => {
    const { paymentID } = req.params;
    const { status } = req.body;

    try {
        const updatedPayment = await upgradePaymentStatus(paymentID, status);
        if (!updatedPayment) {
            return res.status(404).json({
                success: false,
                message: 'Paiement non trouvé'
            });
        };
        res.status(200).json({
            success: true,
            message: 'Statut du paiement mis à jour avec succès',
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut du paiement :', error);
        res.status(500).json({
            success: false,
            message: 'Erreur technique, réessayer plus tard'
        });
    };
};

const getProcessingPayments = async (req, res) => {
    try {
        const processingPayments = await collectProcessingPayments();
        if (!processingPayments) {
            return res.status(404).json({
                success: false,
                message: 'Aucun paiement en cours de traitement trouvé'
            });
        };
        res.status(200).json({
            success: true,
            message: 'Paiements en cours de traitement récupérés avec succès',
            processingPayments: processingPayments
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des paiements en cours de traitement :', error);
        res.status(500).json({
            success: false,
            message: 'Erreur technique, réessayer plus tard'
        });
    };
};

const getCompletedPayments = async (req, res) => {
    try {
        const completedPayments = await collectCompletedPayments();
        if (!completedPayments) {
            return res.status(404).json({
                success: false,
                message: 'Aucun paiement terminé trouvé'
            });
        };
        res.status(200).json({
            success: true,
            message: 'Paiements terminés récupérés avec succès',
            completedPayments: completedPayments
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des paiements terminés :', error);
        res.status(500).json({
            success: false,
            message: 'Erreur technique, réessayer plus tard'
        });
    };
};

const getFailedPayments = async (req, res) => {
    try {
        const failedPayments = await collectFailedPayments();
        if (!failedPayments) {
            return res.status(404).json({
                success: false,
                message: 'Aucun paiement en échec trouvé'
            });
        };
        res.status(200).json({
            success: true,
            message: 'Paiements en échec récupérés avec succès',
            failedPayments: failedPayments
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des paiements en échec :', error);
        res.status(500).json({
            success: false,
            message: 'Erreur technique, réessayer plus tard'
        });
    };
};
    


module.exports = {
    getPaymentByUserID,
    getPaymentProcess,
    getPayments,
    getCompletedPayments,
    getFailedPayments,
    getProcessingPayments,
    updatePaymentStatus,
};