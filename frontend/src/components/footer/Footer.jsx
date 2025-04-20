import React from 'react';
import { faFacebook, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { textWhiteWithoutBg } from '../../config/logos';
import './Footer.scss';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="card">
                <Link to="/">
                    <img src={textWhiteWithoutBg} alt="logo" />
                </Link>
            </div>
            <div className="footer-content">
                {/* About Section */}
                <div className="footer-section">
                    <h3>À propos</h3>
                    <ul>
                        <li><a href="/about">Qui sommes-nous</a></li>
                        {/* <li><a href="/pub">Publicité</a></li> */}
                        <li><a href="/business">Pour les entreprises</a></li>
                        {/* <li><a href="/pricing">Tarifs</a></li> */}
                    </ul>
                </div>

                {/* Help Section */}
                <div className="footer-section">
                    <h3>Assistance</h3>
                    <ul>
                        <li><a href="/help">Centre d'aide</a></li>
                        <li><a href="/contact-us">Contact</a></li>
                    </ul>
                </div>

                {/* Legal Section */}
                <div className="footer-section">
                    <h3>Légal</h3>
                    <ul>
                        <li><a href="/legal/terms">Conditions d'utilisation</a></li>
                        <li><a href="/legal/privacy-policy">Règles de confidentialité</a></li>
                        <li><a href="/legal/post-rules">Règles de publication</a></li>
                    </ul>
                </div>

                {/* Offres */}
                <div className="footer-section">
                    <h3>Offres</h3>
                    <ul>
                        <li><a href="/advertise">AdsCity Publicité</a></li>
                        <li><a href="/store">Création de boutique</a></li>
                        {/* <li><a href="/forfait">Forfaits</a></li> */}
                    </ul>
                </div>

                {/* Business Section */}
                {/* <div className="footer-section">
                    <h3>Business</h3>
                    <ul>
                        <li><a href="/advertise">Publicité</a></li>
                        <li><a href="/pro">Espace Pro</a></li>
                        <li><a href="/pricing">Tarifs</a></li>
                        <li><a href="/partners">Partenaires</a></li>
                    </ul>
                </div> */}
            </div>

            {/* Social Media */}
            <div className="social-media">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faFacebook} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faYoutube} />
                </a>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <p>&copy; {currentYear} AdsCity. Tous droits réservés.</p>
                <p>Publiez, Vendez, Echangez</p>
                {/* <div className="app-downloads">
                    <a href="/ios-app">
                        <img src="/app-store.png" alt="Download on App Store" />
                    </a>
                    <a href="/android-app">
                        <img src="/play-store.png" alt="Get it on Google Play" />
                    </a>
                </div> */}
            </div>
        </footer>
    );
};
