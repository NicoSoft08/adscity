const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();


const PORT = process.env.PORT || 4000;


const {
    markNotificationAsRead,
} = require('./firebase/firestore');

const authServices = require('./services/authServices');
const userServices = require('./services/userServices');
const adServices = require('./services/adServices');
const storageServices = require('./services/storageServices');
const paymentServices = require('./services/paymentServices');
const favorisServices = require('./services/favorisServices');
const updateServices = require('./services/updateServices');
const notificationServices = require('./services/notificationServices');
const { checkFreeTrialExpiry, adStatusChecker } = require('./cron');
const { createDefaultAdmin } = require('./firebase/auth');
const { createNodemailerTransport } = require('./func');


// Mettre en place un cron job pour exécuter la vérification chaque jour à minuit
cron.schedule('0 0 * * *', async () => {
    console.log('Vérification quotidienne des périodes d\'essai...');
    await checkFreeTrialExpiry();
});



// Runs every hour
cron.schedule('0 * * * *', async () => {
    await adStatusChecker();
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.get('', async (req, res) => {
    res.send('AdsCity Server is running')
});


app.patch('/notifications/:notificationID/read', async (req, res) => {
    const { notificationID } = req.params;

    try {
        await markNotificationAsRead(notificationID);

        res.status(200).json({ message: 'Notification marquée comme lue.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.use('/api', updateServices);
app.use('/api/ads', adServices);
app.use('/api', storageServices);
app.use('/api/auth', authServices);
app.use('/api/users', userServices);
app.use('/api/payment', paymentServices);
app.use('/api/favoris', favorisServices);
app.use('/api/notifications', notificationServices);


app.listen(PORT, async () => {
    console.log(`Server started at http://localhost:${PORT}`);
    await createDefaultAdmin(); // Créer un compte administrateur par défaut
});