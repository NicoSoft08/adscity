import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ReactCodeInput from 'react-code-input';
// import InstallAppModal from '../../utils/popup/InstallAppModal';
// import { getFCMToken } from '../../firebase/messaging';
import { checkCode } from '../../services/userServices';
import '../../styles/SignupSuccess.scss';



export default function SignupSuccess() {
    const location = useLocation();
    const userData = location.state?.userData;
    // const [showPopup, setShowPopup] = useState(true);
    const [isVerified, setIsVerified] = useState(false);
    const [code, setCode] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');



    const handleChange = (value) => {
        const sanitizedValue = value.replace(/\D/g, '');
        setCode(sanitizedValue);

        if (sanitizedValue.length === 6) {
            setTimeout(() => {
                handleSubmit(sanitizedValue);
            }, 500);
        }
    };


    const handleSubmit = async (code) => {

        try {
            const result = await checkCode(userData?.email, code);

            if (result.error) {
                setError('Erreur lors de la vérification du code');
                setSuccess('');
                setIsVerified(false);
            } else {
                setSuccess('Code vérifié avec succès !');
                setError('');
                setIsVerified(true);
            }
        } catch (error) {
            setError('Une erreur est survenue. Veuillez réessayer.');
            setSuccess('');
        }
    };


    if (!userData) {
        // Gestion de l'erreur ou redirection si les données sont manquantes
        console.error("Aucune donnée utilisateur trouvée");
        return <div>Erreur: Aucune donnée utilisateur trouvée</div>;
    }

    const { email, displayName } = userData;

    return (
        <div className='signup-success-page'>
            <h1>Inscription Réussie ! Bienvenue chez AdsCity</h1>
            <p>Merci pour votre inscription, <strong>{displayName}</strong> ! Nous sommes ravis de vous compter parmi nous.</p>
            <p>Veuillez vérifier votre boîte de réception email, un code de vérification vous a été envoyé à <strong>{email}</strong>.</p>
            <p>Entrez le code à 6 chiffres</p>
            <ReactCodeInput
                value={code}
                type='text'
                fields={6}
                className="code-input"
                onChange={handleChange}
            />
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
            {isVerified && (
                <>
                    <p>Vous pouvez maintenant accéder à votre compte en utilisant vos identifiants. Cliquez sur le bouton ci-dessous pour vous connecter et commencer à explorer nos services.</p>
                    <Link to={`/auth/signin/${email}`} className="button">Accéder à Mon Compte</Link>
                </>
            )}

            <h2>Premiers Pas</h2>
            <ul>
                <li><Link to="#">Guide de démarrage rapide</Link></li>
                <li><a href="https://youtube.com/@AdsCity24" >Tutoriels vidéo</a></li>
                <li><Link to="/faqs">FAQ</Link></li>
            </ul>
            <h2>Contactez-nous</h2>
            <p>Si vous avez des questions ou besoin d'assistance, n'hésitez pas à nous contacter via notre <Link to={"/contact-us"}>page de support</Link> ou à envoyer un email à <a href="mailto:support@adscity.net">support@adscity.net</a>.</p>
            <div className="links">
                <Link to={'/'}>Retour à la Page d'Accueil</Link>
                {/* <Link to="#">Consulter notre Blog</Link> */}
                <Link to={'/our-services'}>Découvrir Nos Services</Link>
            </div>
            <p>Merci de faire confiance à AdsCity. Nous sommes impatients de vous accompagner et de vous aider à atteindre vos objectifs.</p>
            <a href="https://mail.google.com/" className="button">Vérifier ma boîte Gmail</a>
            {/* {showPopup && <InstallAppModal onClose={handleClosePopup} requestNotificationPermission={requestNotificationPermission} userID={userID} />} */}
        </div>
    );
};
