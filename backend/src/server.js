const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');

const nodemailer = require('nodemailer');

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
const { checkFreeTrialExpiry, adStatusChecker } = require('./cron');
const { createDefaultAdmin } = require('./firebase/auth');


// Mettre en place un cron job pour exécuter la vérification chaque jour à minuit
cron.schedule('0 0 * * *', async () => {
    console.log('Vérification quotidienne des périodes d\'essai...');
    await checkFreeTrialExpiry();
});


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASS,
    },
    logger: true, // Active les logs
    debug: true,  // Active le mode debug
});

const mailOptions = {
    from: `"AdsCity" <${process.env.SMTP_MAIL}>`,
    to: 'n.dahpenielnicolas123@gmail.com',
    replyTo: process.env.SMTP_MAIL,
    subject: '🎉 Bienvenue à AdsCity ! Nous sommes ravis de vous compter parmi nous.',
    html: `
    <html>
    <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <footer style="text-align: center; margin-top: 20px; padding: 20px 0; background-color: #f4f4f4;">
                   
                    <p style="font-size: 12px; color: #777;">2024 © AdsCity. Tous droits réservés.</p>
                    <p style="font-size: 12px; color: #777;">
                        2 Kasnodarskaya 113/1, Rostov-Na-Donu, Russie | Téléphone: +7 (951) 516-95-31 | 
                        Email: <a href="mailto:contact@adscity.net" style="color: #417abc; text-decoration: none;">contact@adscity.net</a>
                    </p>
                    <p style="font-size: 12px; color: #417abc; font-weight: regular; margin-top: 10px;">Publiez, Vendez, Echangez</p>
                </footer>
    </body>
    </html>
    `,
}

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
    } else {
        console.log('E-mail envoyé avec succès :', info.response);
    }
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
app.use('/api', storageServices);
app.use('/api/favoris', favorisServices);
app.use('/api/payment', paymentServices);
app.use('/api/auth', authServices);
app.use('/api/users', userServices);
app.use('/api/ads', adServices);


app.listen(PORT, async () => {
    console.log(`Server started at http://localhost:${PORT}`);
    await createDefaultAdmin(); // Créer un compte administrateur par défaut
});