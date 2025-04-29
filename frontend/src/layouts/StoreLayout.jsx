import React, { useContext, useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { letterWhiteBgBlue } from '../config/logos';
import Footer from '../components/footer/Footer';
import { AuthContext } from '../contexts/AuthContext';
import Modal from '../customs/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import '../styles/AdvertisingLayout.scss';

export default function StoreLayout() {
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const [isScrolled, setIsScrolled] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    // Handle scroll event to change header style when scrolled
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    const handleGetStarted = () => {
        if (!currentUser) {
            setOpenModal(true);
        } else {
            navigate('create');
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleLogin = () => {
        // Utiliser state au lieu de query params pour une meilleure fiabilité
        navigate('/auth/signin', {
            state: { redirectUrl: '/stores/create' }
        });
    };

    const handleSignup = () => {
         navigate('/auth/create-user');
    };

    return (
        <div>
            <header className={`advertising-header ${isScrolled ? 'scrolled' : ''}`}>
                <div className="header-container">
                    <div className="logo-container">
                        <Link to="/">
                            <img src={letterWhiteBgBlue} alt="AdsCity Logo" className="logo" />
                        </Link>
                        <span className="logo-divider"></span>
                        <span className="advertising-label">
                            Boutiques
                        </span>
                    </div>

                    {/* Desktop Navigation */}

                    <button className="start-store-btn" onClick={handleGetStarted}>
                        Créer une boutique
                    </button>
                </div>
            </header >

            {openModal && (
                <Modal title={"Connexion requise"} onShow={openModal} onHide={handleCloseModal}>
                    <div className="auth-required-modal">
                        <div className="modal-body">
                            <div className="modal-icon">
                                <FontAwesomeIcon icon={faLock} size="3x" />
                            </div>
                            <p>Vous devez être connecté pour créer une boutique sur AdsCity.</p>
                            <div className="auth-options">
                                <button className="login-btn" onClick={handleLogin}>
                                    <FontAwesomeIcon icon={faUser} />
                                    Se connecter
                                </button>

                                <button className="signup-btn" onClick={handleSignup}>
                                    Créer un compte
                                </button>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <p className="info-text">
                                La création d'une boutique vous permet de présenter tous vos produits et services
                                dans un espace dédié et personnalisé. <Link to="/help/stores"> En savoir plus.</Link>
                            </p>
                        </div>
                    </div>
                </Modal>
            )}

            <Outlet />

            <Footer />
        </div>
    )
}
