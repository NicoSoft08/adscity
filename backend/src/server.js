const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');

const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 4000;


// Importation des routes
const apiRoutes = require('./routes/apiRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const storageRoutes = require('./routes/storageRoutes');
const postRoutes = require('./routes/postRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const chatRoutes = require('./routes/chatRoutes');
const translateRoutes = require('./routes/translateRoutes');
const statusRoutes = require('./routes/statusRoutes');
const updateServices = require('./services/updateServices');

const { checkFreeTrialExpiry, markPostsAsExpired } = require('./cron');
const { createDefaultSuperAdmin } = require('./firebase/admin');
const { cleanupVerificationDocuments } = require('./middlewares/documentLifecycle');
const { deletionReminder, deleteOldAdminLogs, deleteOldClientLogs, cleanupOldProfileVisits } = require('./firebase/cleanup');
const { verifyImport } = require('./func/exportData');

// Marquer les annonces comme expirées (Tous les jours à minuit)
cron.schedule("0 0 * * *", async () => {
    console.log("✅ Annonces expirées mises à jour !");
    await markPostsAsExpired();
    console.log('Vérification quotidienne des périodes d\'essai...');
    await checkFreeTrialExpiry();
    console.log('🧹 Nettoyage des documents de vérification expirés...');
    await cleanupVerificationDocuments();
});

// Supprimer les annonces expirées depuis plus d’un mois (Tous les 1er du mois à 3h du matin)
cron.schedule("0 3 1 * *", async () => {
    console.log("🗑️ Annonces expirées supprimées après 1 mois !");
    await deleteOldExpiredPosts();

    console.log("🧹 Running monthly cleanup of old profile visit data");
    const result = await cleanupOldProfileVisits(90); // Keep 90 days of history
    console.log(`Cleanup complete: ${result.usersUpdated} users updated`);
});

// Envoyer une notification avant la suppression (Tous les dimanches à 2h)
cron.schedule("0 2 * * 0", async () => {
    console.log(`🔔 Notification envoyée`);
    await deletionReminder();
    console.log("🧹 Running weekly cleanup of old admin logs");
    await deleteOldAdminLogs();
    console.log("🧹 Running weekly cleanup of old client logs");
    await deleteOldClientLogs();
});

// cron.schedule('*/5 * * * *', async () => {
//     console.log('Vérification des status des paiements en cours...');
//     await paymentStatusChecker();
// });


const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware pour parser les cookies - IMPORTANT: doit être avant les routes
app.use(cookieParser());

// Configuration CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://adscity.net', 'https://admin.adscity.net', 'https://auth.adscity.net', 'https://dashboard.adscity.net', 'https://help.adscity.net']
        : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004'],
    credentials: true // Important pour permettre l'envoi de cookies
}));

app.get('', async (req, res) => {
    res.send('AdsCity Server is running');
});

app.use('/api', updateServices);

app.use('/api/do', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/conversations', chatRoutes);
app.use('/api/translations', translateRoutes);


app.listen(PORT, async () => {
    console.log(`Server started at http://localhost:${PORT}`);
    // await createDefaultAdmin(); // Créer un compte administrateur par défaut
    await createDefaultSuperAdmin(); // Créer un compte super administrateur par défaut
    // await formatRegisterDate(); // Mettre à jour la date de création des utilisateurs

});