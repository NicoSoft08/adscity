import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Footer from '../components/footer/Footer';
import { letterWhiteBgBlue } from '../config/logos';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChartLine, faLightbulb, faMapMarkerAlt, faQuestionCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import '../styles/AdvertisingLayout.scss';

export default function AdvertisingLayout() {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    // Scroll to section when nav link is clicked
    const scrollToSection = (sectionId) => {
        setMobileMenuOpen(false);
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleGetStarted = () => {
        navigate('create');
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
                            Publicités
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="desktop-nav">
                        <ul>
                            <li>
                                <a
                                    href="#advantages"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection('advantages');
                                    }}
                                >
                                    <FontAwesomeIcon icon={faChartLine} />
                                    Avantages
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#options"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection('options');
                                    }}
                                >
                                    <FontAwesomeIcon icon={faLightbulb} />
                                    Options
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#placements"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection('placements');
                                    }}
                                >
                                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                                    Emplacements
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#faq"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection('faq');
                                    }}
                                >
                                    <FontAwesomeIcon icon={faQuestionCircle} />
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <button className="get-started-btn" onClick={handleGetStarted}>
                        Commencer
                    </button>

                    {/* Mobile Menu Toggle */}
                    <div className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} />
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
                    <ul>
                        <li>
                            <a
                                href="#advantages"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('advantages');
                                }}
                            >
                                <FontAwesomeIcon icon={faChartLine} />
                                Avantages
                            </a>
                        </li>
                        <li>
                            <a
                                href="#options"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('options');
                                }}
                            >
                                <FontAwesomeIcon icon={faLightbulb} />
                                Options
                            </a>
                        </li>
                        <li>
                            <a
                                href="#placements"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('placements');
                                }}
                            >
                                <FontAwesomeIcon icon={faMapMarkerAlt} />
                                Emplacements
                            </a>
                        </li>
                        <li>
                            <a
                                href="#faq"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('faq');
                                }}
                            >
                                <FontAwesomeIcon icon={faQuestionCircle} />
                                FAQ
                            </a>
                        </li>
                        <li className="mobile-cta">
                            <button className="get-started-btn" onClick={handleGetStarted}>
                                Commencer
                            </button>
                        </li>
                    </ul>
                </div>
            </header >

            <Outlet />

            <Footer />
        </div >
    );
};
