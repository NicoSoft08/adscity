import React, { useEffect } from 'react';
import '../styles/SignupSuccessModal.scss';

export default function SignupSuccessModal({ email, isSignupSuccess, setIsSignupSuccess }) {
    useEffect(() => {
        if (isSignupSuccess) {
            const timer = setTimeout(() => {
                setIsSignupSuccess(false);
            }, 3000);

            // Nettoyage du timer si le composant est démonté ou si l'état change
            return () => clearTimeout(timer);
        }
    }, [isSignupSuccess, setIsSignupSuccess]);

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Inscription réussie !</h2>
                <p>Un email de vérification a été envoyé à votre adresse {email}.</p>
                <p>Veuillez vérifier votre email pour activer votre compte.</p>
            </div>
        </div>
    );
};
