import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

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
    const isLogin = location.pathname === '/auth/signin';
    const isSignup = location.pathname === '/auth/create-user';
    const isSignupConfirm = location.pathname === '/auth/signup-verify-email';
    const isPasswordReset = location.pathname === '/auth/reset-password';
    const isSignupSuccess = location.pathname === '/auth/signup-success';

    let leftLink = '/';
    let leftText = 'Accueil';

    if (isSignup || isSignupConfirm || isPasswordReset || isSignupSuccess) {
        leftLink = '/auth/signin';
        leftText = 'Connexion';
    }

    return (
        <div style={styles.wrap}>
            <a href={leftLink} style={styles.left}>
                <FontAwesomeIcon icon={faChevronLeft} />
                <span style={styles.leftTitle}>{leftText}</span>
            </a>
            {isLogin && (
                <a href="/auth/create-user" style={styles.right}>
                    <span style={styles.rightTitle}>Inscription</span>
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
