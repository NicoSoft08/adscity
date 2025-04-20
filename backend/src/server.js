const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');

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

const updateServices = require('./services/updateServices');

// const { createNodemailerTransport } = require('./func');

const {
    checkFreeTrialExpiry,
    paymentStatusChecker,
    markPostsAsExpired,
    formatRegisterDate,
} = require('./cron');
const {
    // createDefaultAdmin, 
    createDefaultSuperAdmin
} = require('./firebase/admin');
const { createNodemailerTransport } = require('./func');
const { cleanupVerificationDocuments } = require('./middlewares/documentLifecycle');
const { deletionReminder, deleteOldAdminLogs, deleteOldClientLogs, cleanupOldProfileVisits } = require('./firebase/cleanup');
const { pool } = require('./postgres');
const { migrateUsers, migratePosts } = require('./config/migration-script');


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
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.get('', async (req, res) => {
    res.send('AdsCity Server is running');
});

app.get('/api/test-email', async (req, res) => {
    const nodemailerTransport = createNodemailerTransport();
    const mailOptions = {
        from: 'support@adscity.net',
        to: 'n.dahpenielnicolas123@gmail.com',
        subject: 'Test email',
        text: 'This is a test email from AdsCity server',
    };

    try {
        await nodemailerTransport.sendMail(mailOptions);
        res.send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }
})

app.use('/api', updateServices);

app.use('/api/do', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/posts', postRoutes);
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