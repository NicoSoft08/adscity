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


const updateServices = require('./services/updateServices');
const {
    checkFreeTrialExpiry,
    paymentStatusChecker,
    markPostsAsExpired,
    deleteOldExpiredPosts,
    deletionReminder,
} = require('./cron');
const {
    // createDefaultAdmin, 
    createDefaultSuperAdmin
} = require('./firebase/admin');


// Mettre en place un cron job pour exécuter la vérification chaque jour à minuit
cron.schedule('0 0 * * *', async () => {
    console.log('Vérification quotidienne des périodes d\'essai...');
    await checkFreeTrialExpiry();
});

// Marquer les annonces comme expirées (Tous les jours à minuit)
cron.schedule("0 0 * * *", async () => {
    console.log("✅ Annonces expirées mises à jour !");
    await markPostsAsExpired();
});

// Supprimer les annonces expirées depuis plus d’un mois (Tous les 1er du mois à 3h du matin)
cron.schedule("0 3 1 * *", async () => {
    console.log("🗑️ Annonces expirées supprimées après 1 mois !");
   await deleteOldExpiredPosts();
});

// Envoyer une notification avant la suppression (Tous les dimanches à 8h)
cron.schedule("0 8 * * 0", async () => {
    console.log(`🔔 Notification envoyée`);
    await deletionReminder();
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

app.use('/api', updateServices);

app.use('/api/do', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/conversations', chatRoutes);


app.listen(PORT, async () => {
    console.log(`Server started at http://localhost:${PORT}`);
    // await createDefaultAdmin(); // Créer un compte administrateur par défaut
    await createDefaultSuperAdmin(); // Créer un compte super administrateur par défaut
});