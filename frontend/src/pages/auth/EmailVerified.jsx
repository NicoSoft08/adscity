import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { LanguageContext } from '../../contexts/LanguageContext';
import '../../styles/SignupVerifyEmail.scss';

export default function EmailVerified() {
    const [countdown, setCountdown] = useState(5);
    const navigate = useNavigate();
    const location = useLocation();
    const { language } = useContext(LanguageContext);

    useEffect(() => {
        // Start countdown for redirection
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/auth/login');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <div className="email-verification-container">
            <div className="verification-card success-card">
                <div className="verification-icon">
                    <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
                </div>

                <h2>{language === 'FR' ? 'Email vérifié avec succès!' : 'Email successfully verified!'}</h2>

                <p>
                    {language === 'FR'
                        ? `Votre adresse email a été vérifiée. Vous serez redirigé vers la page de connexion dans ${countdown} secondes...`
                        : `Your email address has been verified. You will be redirected to the login page in ${countdown} seconds...`}
                </p>

                <div className="verification-actions">
                    <button
                        className="continue-btn"
                        onClick={() => navigate('/auth/login')}
                    >
                        {language === 'FR' ? 'Se connecter maintenant' : 'Login now'}
                    </button>
                </div>
            </div>
        </div>
    );
}
