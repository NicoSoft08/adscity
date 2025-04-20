import React from 'react';
import { IconNotAllowed } from '../../config/images';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        padding: '20px',
    },
    img: {
        width: '100px',
    },
    title: {
        fontSize: '2em',
        color: '#dc3545',
    },
    message: {
        fontSize: '1.2em',
        color: '#6c757d',
        marginBottom: '20px',
    },
    link: {
        color: '#417abc',
        textDecoration: 'none',
    }
};

export default function AccessDenied() {
    return (
        <div style={styles.container}>
            <img src={IconNotAllowed} style={styles.img} alt='access-denied' />
            <h1 style={styles.title}>Accès Refusé</h1>
            <p style={styles.message}>
                Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
            </p>
            <a href="/" style={styles.link}>Retour à la page d'accueil</a>
        </div>
    );
};
