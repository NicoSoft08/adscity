import React, { useContext } from 'react';
import { faFacebook, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { textWhiteWithoutBg } from '../../config/logos';
import { LanguageContext } from '../../contexts/LanguageContext';
import { translations } from '../../langs/translations';
import './Footer.scss';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const { language } = useContext(LanguageContext);
    const t = translations[language] || translations.FR;

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
                    <h3>
                        {language === 'FR' ? 'À propos' : 'About'}
                    </h3>
                    <ul>
                        <li><a href="/about">{language === 'FR'
                            ? 'Qui sommes-nous' : 'Who we are'
                        }</a></li>
                        {/* <li><a href="/pub">Publicité</a></li> */}
                        <li><a href="/business">
                            {language === 'FR'
                                ? "Pour les entreprises" : "For businesses"
                            }
                        </a></li>
                        {/* <li><a href="/pricing">Tarifs</a></li> */}
                    </ul>
                </div>

                {/* Help Section */}
                <div className="footer-section">
                    <h3>Assistance</h3>
                    <ul>
                        <li><a href="/help">{language === 'FR'
                            ? "Centre d'aide" : "Help Center"
                        }</a></li>
                        <li><a href="/contact-us">Contact</a></li>
                    </ul>
                </div>

                {/* Legal Section */}
                <div className="footer-section">
                    <h3>
                        {language === 'FR' ? 'Légal' : 'Legal'}
                    </h3>
                    <ul>
                        <li><a href="/legal/terms">
                            {language === 'FR' ? "Conditions d'utilisation" : "Terms of use"}
                        </a></li>
                        <li><a href="/legal/privacy-policy">
                            {language === 'FR' ? "Règles de confidentialité" : "Privacy Policy"}
                        </a></li>
                        <li><a href="/legal/post-rules">
                            {language === 'FR' ? "Règles de publication" : "Publication rules"}
                        </a></li>
                    </ul>
                </div>

                {/* Offres */}
                <div className="footer-section">
                    <h3>
                        {language === 'FR' ? 'Offres' : 'Offers'}
                    </h3>
                    <ul>
                        <li><a href="/pubs">
                            {language === 'FR' ? "Publicité" : "Advertising"}
                        </a></li>
                        <li><a href="/stores">
                            {language === 'FR' ? "Boutiques" : "Stores"}
                        </a></li>
                        <li><a href="/forfait">Forfaits</a></li>
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
                <p>&copy; {currentYear} AdsCity. {language === 'FR' ? "Tous droits réservés." : "All rights reserved."}</p>
                <p>{t.loading}</p>
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
