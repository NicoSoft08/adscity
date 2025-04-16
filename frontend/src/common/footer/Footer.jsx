import React from 'react';
import './Footer.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faYoutube, faWhatsapp, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { logos } from '../../config';
import { Link } from 'react-router-dom';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const startYear = 2024;
    const signature = startYear === currentYear ? `&copy; ${startYear} AdsCity - Publiez, Vendez, Echangez` : `&copy; ${startYear} - ${currentYear} AdsCity - Publiez, Vendez, Echangez`;
    const getAllSignature = document.querySelectorAll('#signature');
    getAllSignature.forEach(element => {
        element.innerHTML = signature;
    });

    return (
        <footer className='footer'>
            <div className="content">
                <div className="social-media">
                    <div className="whatsapp">
                        <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faWhatsapp} className='icon' />
                        </a>
                    </div>
                    <div className="instagram">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faInstagram} className='icon' />
                        </a>
                    </div>
                    <div className="facebook">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faFacebookF} className='icon' />
                        </a>
                    </div>
                    <div className="youtube">
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faYoutube} className='icon' />
                        </a>
                    </div>
                </div>
                <div className="footer-nav">
                    <div className="card">
                        <Link to="/">
                            <img src={logos.textWhiteWithoutBg} alt="logo" />
                        </Link>
                    </div>
                    <div className="card">
                        <h4>Qui Sommes Nous ?</h4>
                        <p><Link to="/career">Notre Equipe</Link></p>
                        <p><Link to="/legal">Confidentialité</Link></p>
                        <p><Link to="/legal">CGU</Link></p>
                    </div>
                    <div className="card">
                        <h4>Besoin d'aide ?</h4>
                        <p><Link to="/help-center/faq">FAQs</Link></p>
                        <p><Link to="/help-center">Aide</Link></p>
                        <p><Link to="/contact-us">Contactez-nous</Link></p>
                    </div>
                    <div className="card">
                        <h4>Offres</h4>
                        <p><Link to="/ads/promotion">AdsCity Publicité</Link></p>
                        <p><Link to="/store/create">Création de boutique</Link></p>
                        <p><Link to="/subscriptions">Abonnements Pros</Link></p>
                        <p><Link to="/campaign">Campagne personnalisée</Link></p>
                    </div>
                </div>
                <div className='signature'>
                    &copy; {startYear} AdsCity - Publiez, Vendez, Echangez
                </div>
            </div>
        </footer>
    );
};
