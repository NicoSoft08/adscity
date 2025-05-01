import React, { useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { LanguageContext } from '../contexts/LanguageContext';

const frontendUrl = process.env.REACT_APP_FRONTEND_URL;

// styles
const styles = {
    wrap: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px',
        backgroundColor: '#417abc',
    }, left: {
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
    }, leftTitle: {
        marginLeft: '8px',
        cursor: 'pointer',
    }, right: {
        textDecoration: 'none',
    }, rightTitle: {
        cursor: 'pointer',
        color: '#fff',
    },
};

const AuthLayoutHeader = () => {
    const location = useLocation();
    const { language } = useContext(LanguageContext);
    const isLogin = location.pathname === '/signin';
    const isSignup = location.pathname === '/signup';
    const isSignupConfirm = location.pathname === '/signup/verify-email';
    const isPasswordReset = location.pathname === '/reset-password';
    const isSignupSuccess = location.pathname === '/signup/success';

    let leftLink = `${frontendUrl}`;
    let leftText = language === 'FR'
        ? 'Accueil'
        : 'Home';

    if (isSignup || isSignupConfirm || isPasswordReset || isSignupSuccess) {
        leftLink = '/signin';
        leftText = language === 'FR'
            ? 'Connexion'
            : 'Login';
    }

    return (
        <div style={styles.wrap}>
            <a href={leftLink} style={styles.left}>
                <FontAwesomeIcon icon={faChevronLeft} />
                <span style={styles.leftTitle}>{leftText}</span>
            </a>
            {isLogin && (
                <a href="/auth/create-user" style={styles.right}>
                    <span style={styles.rightTitle}>
                        {language === 'FR' ? "Inscription" : "Signup"}
                    </span>
                </a>
            )}
        </div>
    );
}

export default function AuthLayout() {
    return (
        <div>

            <AuthLayoutHeader />

            <Outlet />

        </div>
    );
};