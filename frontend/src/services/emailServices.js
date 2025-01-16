import emailjs from 'emailjs-com';

const sendVerificationEmail = async (displayName, email, code) => {
    const templateParams = {
        displayName: displayName,
        to_email: email,
        code: code,
        reply_to: 'noreply@adscity.net',
    };

    emailjs.send(
        process.env.EMAILJS_SERVICE_ID,
        process.env.EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.EMAILJS_USER_ID
    )
        .then((response) => {
            console.log('Email envoyé avec succès :', response.status, response.text);
        })
        .catch((error) => {
            console.error('Erreur lors de l\'envoi de l\'email :', error);
        });
};

export { sendVerificationEmail };