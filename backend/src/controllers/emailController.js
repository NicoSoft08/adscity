const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const {
    formateDateTimestamp,
    generateVerificationToken,
    createNodemailerTransport
} = require('../func');
const { firestore } = require('../config/firebase-admin');

const PUBLIC_URL = process.env.PUBLIC_URL;

const logoPath = path.resolve(__dirname, '../assets/blue-no-bg.png');
const logoBase64 = fs.readFileSync(logoPath, { encoding: 'base64' });

const sendCode = async (displayName, email, code) => {
    const nodemailerTransport = createNodemailerTransport();

    const mailOptions = {
        from: `"AdsCity" <${process.env.SMTP_MAIL}>`,
        to: email,
        subject: '✉️ Vérification de votre adresse email',
        html: `
        <html>
            <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd;">
                    <h3 style="color: #417abc;">Bonjour ${displayName},</h3>
                    <p>Vous avez initié une inscription sur la plateforme <strong>AdsCity</strong>.</p>
                    <p>Votre code de vérification est : <strong style="font-size: 18px;">${code}</strong>.</p>
                    <p>Il est valable pendant <strong>24 heures</strong>.</p>
                    <p>Merci de vérifier votre adresse email pour continuer à utiliser AdsCity.</p>
                    
                    <p style="color: red; font-weight: bold; margin-top: 20px;">
                        Attention : ne communiquez jamais ce code à qui que ce soit. AdsCity ne vous demandera jamais de partager votre code de vérification ou toute autre information confidentielle.
                    </p>

                    <p style="margin-top: 20px;">Cordialement,</p>
                    <p style="font-style: italic; color: #777;">L'équipe AdsCity</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <small style="color: #777;">Ce message vous est généré automatiquement et ne nécessite aucune réponse de votre part.</small>
                </div>
                <footer style="text-align: center; margin-top: 20px; padding: 20px 0; background-color: #f4f4f4;">
                    <a href="${PUBLIC_URL}" style="color: #417abc; text-decoration: none;">
                        <img src="data:image/jpeg;base64,${logoBase64}" alt="Logo AdsCity" style="width: 100px; height: auto;">
                    </a>
                    <p style="font-size: 12px; color: #777;">2025 © AdsCity. Tous droits réservés.</p>
                    <p style="font-size: 12px; color: #777;">
                        2 Kasnodarskaya 113/1, Rostov-Na-Donu, Russie | Téléphone: +7 (951) 516-95-31 | 
                        Email: <a href="mailto:support@adscity.net" style="color: #417abc; text-decoration: none;">support@adscity.net</a>
                    </p>
                    <p style="font-size: 12px; color: #417abc; font-weight: regular; margin-top: 10px;">Publiez, Vendez, Echangez</p>
                </footer>
            </body>
        </html>
        `,
    };

    nodemailerTransport.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erreur lors de l\'envoi de l\'email :', error);
        } else {
            console.log('Email envoyé :', info.response);
        }
    });
};

const sendUserAdsApprovedEmail = async (displayName, email, title, posted_at) => {

    // Envoi du code par email
    const nodemailerTransport = createNodemailerTransport();

    const mailOptions = {
        from: `"AdsCity" <${process.env.SMTP_MAIL}>`,
        to: email,
        replyTo: 'support@adscity.net',
        subject: 'Approbation d\'annonces',
        html: `
        <html>
            <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd;">
                    <h3 style="color: #417abc;">Bonjour ${displayName},</h3>
                    <p>Nous avons le plaisir de vous informer que votre annonce intitulée: <strong>${title}</strong>, publiée: <strong>${formateDateTimestamp(posted_at._seconds)}</strong>, a été approuvée avec succès.</p>
                    <p>Votre annonce est désormais visible sur notre plateforme et accessible aux utilisateurs d'AdsCity.</p>
                    <p>Merci de faire confiance à notre service !</p>
                    <p style="margin-top: 20px;">Cordialement,</p>
                    <p style="font-style: italic; color: #777;">L'équipe AdsCity</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <small style="color: #777;">Ce message vous est généré automatiquement et ne nécessite aucune réponse de votre part.</small>
                </div>
                <footer style="text-align: center; margin-top: 20px; padding: 20px 0; background-color: #f4f4f4;">
                    <a href="${PUBLIC_URL}" style="color: #417abc; text-decoration: none;">
                        <img src="data:image/png;base64,${logoBase64}" alt="Logo AdsCity" style="width: 100px; height: auto;">
                    </a>
                    <p style="font-size: 12px; color: #777;">2025 © AdsCity. Tous droits réservés.</p>
                    <p style="font-size: 12px; color: #777;">
                        2 Kasnodarskaya 113/1, Rostov-Na-Donu, Russie | Téléphone: +7 (951) 516-95-31 | 
                        Email: <a href="mailto:support@adscity.net" style="color: #417abc; text-decoration: none;">support@adscity.net</a>
                    </p>
                    <p style="font-size: 12px; color: #417abc; font-weight: regular; margin-top: 10px;">Publiez, Vendez, Echangez</p>
                </footer>
            </body>
        </html>
        `
    };

    nodemailerTransport.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erreur lors de l\'envoi de l\'email :', error);
        } else {
            console.log('Email envoyé :', info.response);
        }
    });
};

const sendUserAdsRefusedEmail = async (displayName, email, title, posted_at, reason) => {
    // Envoi du code par email
    const nodemailerTransport = createNodemailerTransport();

    const mailOptions = {
        from: `"AdsCity" <${process.env.SMTP_MAIL}>`,
        to: email,
        replyTo: 'support@adscity.net',
        subject: 'Approbation d\'annonces',
        html: `
        <html>
            <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd;">
                    <h3 style="color: #417abc;">Bonjour ${displayName},</h3>
                    <p>Nous tenons à vous informer que votre annonce intitulée: <strong>${title}</strong>, publiée: <strong>${formateDateTimestamp(posted_at._seconds)}</strong>, a été refusée.</p>
                    <p><strong>Motif du refus :</strong> ${reason}</p><br/>
                    <p>En vertu de nos <strong><a href="${PUBLIC_URL}/announcement-rules">Règles de publication</a></strong>, nous avons jugé que l'annonce ne respectait pas certaines des directives en vigueur.</p>
                    <p>Si vous avez des questions ou pensez qu'il s'agit d'une erreur, vous pouvez contacter notre service client.</p>
                    <p style="margin-top: 20px;">Cordialement,</p>
                    <p style="font-style: italic; color: #777;">L'équipe AdsCity</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <small style="color: #777;">Ce message vous est généré automatiquement et ne nécessite aucune réponse de votre part.</small>
                </div>
                <footer style="text-align: center; margin-top: 20px; padding: 20px 0; background-color: #f4f4f4;">
                    <a href="${PUBLIC_URL}" style="color: #417abc; text-decoration: none;">
                        <img src="data:image/png;base64,${logoBase64}" alt="Logo AdsCity" style="width: 100px; height: auto;">
                    </a>
                    <p style="font-size: 12px; color: #777;">2025 © AdsCity. Tous droits réservés.</p>
                    <p style="font-size: 12px; color: #777;">
                        2 Kasnodarskaya 113/1, Rostov-Na-Donu, Russie | Téléphone: +7 (951) 516-95-31 | 
                        Email: <a href="mailto:support@adscity.net" style="color: #417abc; text-decoration: none;">support@adscity.net</a>
                    </p>
                    <p style="font-size: 12px; color: #417abc; font-weight: regular; margin-top: 10px;">Publiez, Vendez, Echangez</p>
                </footer>
            </body>
        </html>
        `
    };

    nodemailerTransport.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erreur lors de l\'envoi de l\'email :', error);
        } else {
            console.log('Email envoyé :', info.response);
        }
    });
};

const sendWelcomeEmail = async (displayName, email) => {

    // Envoi du code par email
    const nodemailerTransport = createNodemailerTransport();

    const mailOptions = {
        from: `"AdsCity" <${process.env.SMTP_MAIL}>`,
        to: email,
        subject: '🎉 Bienvenue à AdsCity ! Nous sommes ravis de vous compter parmi nous.',
        html: `
        <html>
            <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd;">
                    <h3 style="color: #417abc;">Bienvenue sur AdsCity, ${displayName} !</h3>
                    <p>Nous sommes ravis de vous compter parmi notre communauté d’utilisateurs. AdsCity est une plateforme dynamique où vous pouvez publier, vendre, louer, échanger ou proposer des services.</p>
                    <p>Pour démarrer :</p>
                    <ul style="list-style-type: circle; margin-left: 20px;">
                        <li>
                            <strong>
                                <a href="${PUBLIC_URL}/auth/create-announcement" style="color: #417abc; text-decoration: none;">
                                    Publiez votre première annonce
                                </a>
                            </strong> : Que vous souhaitiez vendre un produit, louer un bien ou proposer un service, tout est possible sur AdsCity.
                        </li>
                        <li>
                            <strong>
                                <a href="${PUBLIC_URL}/user/dashboard" style="color: #417abc; text-decoration: none;">
                                    Personnalisez votre profil
                                </a>
                            </strong> : Ajoutez une photo et complétez vos informations pour attirer plus d'acheteurs ou de clients potentiels.
                        </li>
                        <li>
                            <strong>
                                <a href="${PUBLIC_URL}" style="color: #417abc; text-decoration: none;">
                                    Explorez les catégories
                                </a>
                            </strong> : Découvrez ce que les autres membres publient et trouvez les meilleures offres dans divers domaines.
                        </li>
                        <li>
                            <strong>
                                <a href="${PUBLIC_URL}/legal/announcement-rules" style="color: #417abc; text-decoration: none;">
                                    Découvrez nos règles de publication
                                </a>
                            </strong> : Assurez-vous que vos annonces respectent nos règles pour une expérience positive pour tous les utilisateurs.
                        </li>
                    </ul>
                    <p>Nous sommes à votre disposition pour toute question ou assistance. N'hésitez pas à nous contacter à <a href="mailto:support@adscity.net" style="color: #417abc; text-decoration: none;">support@adscity.net</a>.</p>
                    <p>Merci d'avoir rejoint AdsCity. Nous vous souhaitons une expérience enrichissante et pleine de succès !</p>
                    <p style="margin-top: 20px;">Cordialement,</p>
                    <p style="font-style: italic; color: #777;">L'équipe AdsCity</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <small style="color: #777;">Ce message vous est généré automatiquement et ne nécessite aucune réponse de votre part.</small>
                </div>
                <footer style="text-align: center; margin-top: 20px; padding: 20px 0; background-color: #f4f4f4;">
                    <a href="${PUBLIC_URL}" style="color: #417abc; text-decoration: none;">
                        <img src="data:image/png;base64,${logoBase64}" alt="Logo AdsCity" style="width: 100px; height: auto;">
                    </a>
                    <p style="font-size: 12px; color: #777;">2025 © AdsCity. Tous droits réservés.</p>
                    <p style="font-size: 12px; color: #777;">
                        2 Kasnodarskaya 113/1, Rostov-Na-Donu, Russie | Téléphone: +7 (951) 516-95-31 | 
                        Email: <a href="mailto:support@adscity.net" style="color: #417abc; text-decoration: none;">support@adscity.net</a>
                    </p>
                    <p style="font-size: 12px; color: #417abc; font-weight: regular; margin-top: 10px;">Publiez, Vendez, Echangez</p>
                </footer>
            </body>
        </html>
        `
    };

    // Envoyer l'email après un délai de 5 minutes
    setTimeout(() => {
        nodemailerTransport.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Erreur lors de l\'envoi de l\'email :', error);
            } else {
                console.log('Email envoyé :', info.response);
            }
        });
    }, 5 * 60 * 1000); // Délai de 5 minutes
};


const sendUserEmailWithTicket = async (displayName, email, object, message, ticketID) => {

    // Envoi du code par email
    const nodemailerTransport = createNodemailerTransport();

    const mailOptions = {
        from: `"AdsCity Support" <${process.env.SMTP_MAIL}>`,
        to: email,
        replyTo: 'support@adscity.net',
        subject: `Accusé de réception - Ticket: ${ticketID}`,
        html: `
        <html>
            <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd;">
                    <h3 style="color: #417abc;">Bonjour ${displayName},</h3>
                    <p>Nous avons bien reçu votre message concernant : <strong>${object}</strong>.</p>
                    <p>Notre équipe vous répondra dans les plus brefs délais.</p>
                    <p>Voici votre numéro de ticket : <strong>${ticketID}</strong>.</p>
                    <p>Message envoyé : <br> <span style="font-style: italic>${message}</span> </p>
                    <p style="margin-top: 20px; font-style: italic">Merci de nous avoir contactés.</p>
                    <p style="margin-top: 20px;">Cordialement,</p>
                    <p style="font-style: italic; color: #777;">L'équipe AdsCity</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <small style="color: #777;">Ce message vous est généré automatiquement et ne nécessite aucune réponse de votre part.</small>
                </div>
                <footer style="text-align: center; margin-top: 20px; padding: 20px 0; background-color: #f4f4f4;">
                    <a href="${PUBLIC_URL}" style="color: #417abc; text-decoration: none;">
                        <img src="data:image/png;base64,${logoBase64}" alt="Logo AdsCity" style="width: 100px; height: auto;">
                    </a>
                    <p style="font-size: 12px; color: #777;">2025 © AdsCity. Tous droits réservés.</p>
                    <p style="font-size: 12px; color: #777;">
                        2 Kasnodarskaya 113/1, Rostov-Na-Donu, Russie | Téléphone: +7 (951) 516-95-31 | 
                        Email: <a href="mailto:support@adscity.net" style="color: #417abc; text-decoration: none;">support@adscity.net</a>
                    </p>
                    <p style="font-size: 12px; color: #417abc; font-weight: regular; margin-top: 10px;">Publiez, Vendez, Echangez</p>
                </footer>
            </body>
        </html>
        `,
    }

    nodemailerTransport.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erreur lors de l\'envoi de l\'email :', error);
        } else {
            console.log('Email envoyé :', info.response);
        }
    });
};


const sendSupportEmail = async (email, displayName, message, object, ticketID) => {

    // Envoi du code par email
    const nodemailerTransport = createNodemailerTransport();

    const mailOptions = {
        from: `"AdsCity Mail Info" <${process.env.SMTP_MAIL}>`,
        to: 'support@adscity.net',
        replyTo: email,
        subject: `Nouveau message de ${displayName} - Ticket #${ticketID}`,
        text: `Détails du message:\n\nNom: ${displayName}\nEmail: ${email}\nObjet: ${object}\nMessage: ${message}\n\nTicket ID: ${ticketID}`,
    }

    nodemailerTransport.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erreur lors de l\'envoi de l\'email :', error);
        } else {
            console.log('Email envoyé :', info.response);
        }
    });
};


const sendNewDeviceAlert = async (email, displayName, deviceInfo, deviceID) => {
    const { browser, os, ip, device } = deviceInfo;
    const verificationToken = generateVerificationToken();
    const verificationLink = `${PUBLIC_URL}/auth/verify-device/${deviceID}/${verificationToken}`;
    const declineLink = `${PUBLIC_URL}/auth/decline-device/${deviceID}/${verificationToken}`;

    const tokenRef = firestore.collection('DEVICE_VERIFY_TOKENS').doc(deviceID);
    const existingTokenDoc = await tokenRef.get();

    if (existingTokenDoc.exists) {
        const existingData = existingTokenDoc.data();
        if (!existingData.used && existingData.expiresAt.toDate() > new Date()) {
            console.log("🔹 Un token valide existe déjà. Pas besoin d'en générer un nouveau.");
            return;
        }
    }

    // ✅ Stocker le nouveau token
    await tokenRef.set({
        token: verificationToken,
        expiresAt: admin.firestore.Timestamp.fromDate(
            new Date(Date.now() + 86400000) // ⏳ 24 heures d'expiration
        ),
        used: false
    });

    const nodemailerTransport = createNodemailerTransport();

    const currentDate = new Date().toLocaleString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    const mailOptions = {
        from: `"AdsCity Security" <${process.env.SMTP_MAIL}>`,
        to: email,
        replyTo: 'support@adscity.net',
        subject: `🚨 Alerte de Détection de Périphérique - Nouvelle Connexion`,
        html: `
            <html>
                <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd;">
                        <h3 style="color: #417abc;">Bonjour, ${displayName} !</h3>
                                                
                        <p>Une tentative de connexion a été détectée sur votre compte AdsCity depuis un nouvel appareil. Voici les détails :</p>
                        
                        <ul style="list-style-type: none; padding: 0;">
                        <li><strong>Périphérique :</strong> ${device}</li>
                            <li><strong>Navigateur :</strong> ${browser}</li>
                            <li><strong>Système :</strong> ${os}</li>
                            <li><strong>Adresse IP :</strong> ${ip}</li>
                            <li><strong>Date:</strong> ${currentDate}</li>
                        </ul>

                        <p>Pour confirmer ou refuser cette connexion, cliquez sur l'un des liens ci-dessous :</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${verificationLink}"
                                style="background-color: #417abc;
                                    color: white;
                                    padding: 12px 24px;
                                    text-decoration: none;
                                    border-radius: 4px;
                                    margin-right: 20px;">
                                Oui, c'est moi
                            </a>
                            <a href="${declineLink}"
                                style="background-color: #ff6162;
                                    color: white;
                                    padding: 12px 24px;
                                    text-decoration: none;
                                    border-radius: 4px;">
                                Non, ce n'est pas moi
                            </a>
                        </div>

                        <p style="color: red;">Si vous n'êtes pas à l'origine de cette connexion, changez immédiatement votre mot de passe.</p>

                        <p>Pour toute assistance, contactez-nous à <a href="mailto:support@adscity.net" style="color: #417abc; text-decoration: none;">support@adscity.net</a>.</p>

                        <p style="margin-top: 20px;">Cordialement,</p>
                        <p style="font-style: italic; color: #777;">L'équipe AdsCity</p>

                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                        <small style="color: #777;">Ce message est généré automatiquement et ne nécessite aucune réponse.</small>
                    </div>

                    <footer style="text-align: center; margin-top: 20px; padding: 20px 0; background-color: #f4f4f4;">
                        <a href="${PUBLIC_URL}" style="color: #417abc; text-decoration: none;">
                            <img src="data:image/png;base64,${logoBase64}" alt="Logo AdsCity" style="width: 100px; height: auto;">
                        </a>
                        <p style="font-size: 12px; color: #777;">2025 © AdsCity. Tous droits réservés.</p>
                        <p style="font-size: 12px; color: #777;">
                            2 Kasnodarskaya 113/1, Rostov-Na-Donu, Russie | Téléphone : +7 (951) 516-95-31 |
                            Email : <a href="mailto:support@adscity.net" style="color: #417abc; text-decoration: none;">support@adscity.net</a>
                        </p>
                        <p style="font-size: 12px; color: #417abc;">Publiez, Vendez, Échangez</p>
                    </footer>
                </body>
            </html>
        `,
    };

    nodemailerTransport.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erreur lors de l\'envoi de l\'email :', error);
        } else {
            console.log('Email envoyé :', info.response);
        }
    });
};


const sendCustomerPaymentIntentEmail = async (paymentData) => {
    // Envoi du code par email
    const nodemailerTransport = createNodemailerTransport();

    const mailOptions = {
        from: `"AdsCity Info" <${process.env.SMTP_MAIL}>`,
        to: 'support@adscity.net',
        // replyTo: 'support@adscity.net',
        subject: `💳 Nouvelle Demande de Paiement - Plan ${paymentData.plan.charAt(0).toUpperCase() + paymentData.plan.slice(1)}`,
        html: `
            <html>
                <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd;">
                        <h3 style="color: #417abc;">Demande de paiement pour le plan ${paymentData.plan.charAt(0).toUpperCase() + paymentData.plan.slice(1)}</h3>
                        <p>Bonjour <strong>Peniel Nicolas N'DAH</strong>,</p>
                        <p>Nous avons reçu votre demande d'abonnement au plan <strong>${paymentData.plan.charAt(0).toUpperCase() + paymentData.plan.slice(1)}</strong>. Voici les détails de votre transaction :</p>
                        <ul style="list-style-type: none; padding: 0;">
                        <li><strong>ID :</strong> ${paymentData.profileNumber}</li>
                            <li><strong>Utilisateur :</strong> ${paymentData.displayName}</li>
                            <li><strong>Email :</strong> ${paymentData.email}</li>
                            <li><strong>Téléphone :</strong> ${paymentData.phoneNumber}</li>
                            <li><strong>Plan :</strong> Forfait ${paymentData.plan.charAt(0).toUpperCase() + paymentData.plan.slice(1)}</li>
                            <li><strong>Montant :</strong> ${paymentData.amount} RUB</li>
                            <li><strong>Méthode de paiement :</strong> ${paymentData.paymentMethod}</li>
                            <li><strong>Fournisseur :</strong> ${paymentData.provider}</li>
                            <li><strong>Date :</strong> ${new Date().toLocaleString()}</li>
                        </ul>
                        <p>Veuillez finaliser votre paiement en utilisant les informations de compte bancaire fournies par ${paymentData.provider}. Une fois le paiement effectué, votre plan sera activé immédiatement.</p>
                        <p>Pour toute assistance ou question, n'hésitez pas à nous contacter à <a href="mailto:support@adscity.net" style="color: #417abc; text-decoration: none;">support@adscity.net</a>.</p>
                        <p>Merci de votre confiance.</p>
                        <p style="margin-top: 20px;">Cordialement,</p>
                        <p style="font-style: italic; color: #777;">L'équipe AdsCity</p>
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                        <small style="color: #777;">Ce message vous est généré automatiquement et ne nécessite aucune réponse.</small>
                    </div>
                    <footer style="text-align: center; margin-top: 20px; padding: 20px 0; background-color: #f4f4f4;">
                        <a href="${PUBLIC_URL}" style="color: #417abc; text-decoration: none;">
                            <img src="data:image/png;base64,${logoBase64}" alt="Logo AdsCity" style="width: 100px; height: auto;">
                        </a>
                        <p style="font-size: 12px; color: #777;">2025 © AdsCity. Tous droits réservés.</p>
                        <p style="font-size: 12px; color: #777;">
                            2 Kasnodarskaya 113/1, Rostov-Na-Donu, Russie | Téléphone : +7 (951) 516-95-31 |
                            Email : <a href="mailto:support@adscity.net" style="color: #417abc; text-decoration: none;">support@adscity.net</a>
                        </p>
                        <p style="font-size: 12px; color: #417abc;">Publiez, Vendez, Échangez</p>
                    </footer>
                </body>
            </html>
        `,
    };

    nodemailerTransport.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erreur lors de l\'envoi de l\'email :', error);
        } else {
            console.log('Email envoyé :', info.response);
        }
    });
};


const sendAdminEmail = async (email, password, displayName) => {
    const admin_url = process.env.ADMIN_URL;

    // Envoi du code par email
    const nodemailerTransport = createNodemailerTransport();

    const mailOptions = {
        from: `"AdsCity" <${process.env.SMTP_MAIL}>`,
        to: email,
        replyTo: process.env.SMTP_MAIL,
        subject: 'Création de compte administrateur',
        html: `
        <html>
            <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd;">
                    <h3 style="color: #417abc;">Bonjour ${displayName},</h3>
                    <p>Nous avons créé un compte administrateur pour vous sur la plateforme <strong>AdsCity</strong>.</p>
                    <p>Votre adresse email : <strong style="font-size: 18px;">${email}</strong>.</p>
                    <p>Votre mot de passe par défaut : <strong style="font-size: 18px;">${password}</strong>.</p>
                    <p>Veuillez vous <a href="${admin_url}">connecter à votre compte</a> en utilisant ces informations et suivez les instructions pour activer votre compte.</p>
                    <p>Nous vous invitons à changer ce mot de passe et de choisir le votre.</p>
                    
                    <p style="color: red; font-weight: bold; margin-top: 20px;">
                        Attention : ne communiquez jamais ce mot de passe à qui que ce soit. AdsCity ne vous demandera jamais de partager votre mot de passe ou toute autre information confidentielle.
                    </p>

                    <p style="margin-top: 20px;">Cordialement,</p>
                    <p style="font-style: italic; color: #777;">L'équipe AdsCity</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <small style="color: #777;">Ce message vous est généré automatiquement et ne nécessite aucune réponse de votre part.</small>
                </div>
                <footer style="text-align: center; margin-top: 20px; padding: 20px 0; background-color: #f4f4f4;">
                    <a href="${PUBLIC_URL}" style="color: #417abc; text-decoration: none;">
                        <img src="data:image/png;base64,${logoBase64}" alt="Logo AdsCity" style="width: 100px; height: auto;">
                    </a>
                    <p style="font-size: 12px; color: #777;">2025 © AdsCity. Tous droits réservés.</p>
                    <p style="font-size: 12px; color: #777;">
                        2 Kasnodarskaya 113/1, Rostov-Na-Donu, Russie | Téléphone: +7 (951) 516-95-31 | 
                        Email: <a href="mailto:support@adscity.net" style="color: #417abc; text-decoration: none;">support@adscity.net</a>
                    </p>
                    <p style="font-size: 12px; color: #417abc; font-weight: regular; margin-top: 10px;">Publiez, Vendez, Echangez</p>
                </footer>
            </body>
        </html>
        `,
    };

    nodemailerTransport.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erreur lors de l\'envoi de l\'email :', error);
        } else {
            console.log('Email envoyé :', info.response);
        }
    });
};

const sendEmailToAdmin = async = (postData, PostID) => {
    const admin_url = process.env.ADMIN_URL;

    // Envoi du code par email
    const nodemailerTransport = createNodemailerTransport();

    const mailOptions = {
        from: `"AdsCity" <${process.env.SMTP_MAIL}>`,
        to: [
            'admin@adscity.net',
            'n.dahpenielnicolas123@gmail.com',
            'koffigalloharistide@gmail.com',
            'josiasyeboua1@yandex.com',
            'plj63376@gmail.com'
        ],
        replyTo: process.env.SMTP_MAIL,
        subject: "Nouvelle annonce en attente",
        html: `
        <html>
            <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd;">
                    <h3 style="color: #417abc;">Bonjour,</h3>
                    <p>Une nouvelle annonce a été postée et attend votre validation.</p>
                    <p><strong>Titre :</strong> ${postData?.details.title}</p>
                    <p><strong>Accéder à l'annonce :</strong> <a href="${admin_url}/admin/dashboard/posts/${PostID}">Voir l'annonce</a></p>

                    <p style="margin-top: 20px;">Cordialement,</p>
                    <p style="font-style: italic; color: #777;">L'équipe AdsCity</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <small style="color: #777;">Ce message vous est généré automatiquement et ne nécessite aucune réponse de votre part.</small>
                </div>
                <footer style="text-align: center; margin-top: 20px; padding: 20px 0; background-color: #f4f4f4;">
                    <a href="${PUBLIC_URL}" style="color: #417abc; text-decoration: none;">
                        <img src="data:image/png;base64,${logoBase64}" alt="Logo AdsCity" style="width: 100px; height: auto;">
                    </a>
                    <p style="font-size: 12px; color: #777;">2025 © AdsCity. Tous droits réservés.</p>
                    <p style="font-size: 12px; color: #777;">
                        2 Kasnodarskaya 113/1, Rostov-Na-Donu, Russie | Téléphone: +7 (951) 516-95-31 | 
                        Email: <a href="mailto:support@adscity.net" style="color: #417abc; text-decoration: none;">support@adscity.net</a>
                    </p>
                    <p style="font-size: 12px; color: #417abc; font-weight: regular; margin-top: 10px;">Publiez, Vendez, Echangez</p>
                </footer>
            </body>
        </html>
        `,
    };

    nodemailerTransport.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erreur lors de l\'envoi de l\'email :', error);
        } else {
            console.log('Email envoyé :', info.response);
        }
    });
}


module.exports = {
    sendCode,
    sendAdminEmail,
    sendUserAdsApprovedEmail,
    sendUserAdsRefusedEmail,
    sendWelcomeEmail,
    sendUserEmailWithTicket,
    sendSupportEmail,
    sendNewDeviceAlert,
    sendEmailToAdmin,
    sendCustomerPaymentIntentEmail
};