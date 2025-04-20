import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBalanceScale, faBan, faBullhorn, faClone, faCopy, faEllipsisV, faExclamationTriangle, faFlag, faGavel, faQuestionCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useBusinessPostActions } from '../../helpers/useHooks';
import Menu from '../../customs/Menu';
import { fetchPubs } from '../../routes/apiRoutes';
import './Pubs.scss';

export const MastheadSlider = ({ interval = 5000 }) => {
    const [businessPosts, setBusinessPosts] = useState([]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const getApprovedAds = async () => {
            const result = await fetchPubs();
            if (result.success) {
                setBusinessPosts(result.pubs);
            }
        };

        getApprovedAds();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % businessPosts.length);
        }, interval);

        return () => clearInterval(timer);
    }, [businessPosts.length, interval]);

    const nextSlide = () => setIndex((prev) => (prev + 1) % businessPosts.length);
    const prevSlide = () => setIndex((prev) => (prev - 1 + businessPosts.length) % businessPosts.length);

    return (
        <div className="masthead-slider">
            <div className="masthead-slider__container">
                <MastheadPub pub={businessPosts[index]} />
            </div>

            {/* Boutons de navigation */}
            <button className="masthead-slider__btn left" onClick={prevSlide}>‹</button>
            <button className="masthead-slider__btn right" onClick={nextSlide}>›</button>

            {/* Indicateurs de position */}
            <div className="masthead-slider__dots">
                {businessPosts.map((_, i) => (
                    <span key={i} className={`dot ${i === index ? "active" : ""}`} onClick={() => setIndex(i)}></span>
                ))}
            </div>
        </div>
    )
};

export const Banner = ({ img, domainName }) => {
    return (
        <div className="banner">

            <img src={img} alt="" className="banner-slide" />

            {domainName ? <p className='domaine-name'> {domainName} </p> : null}
        </div>
    );
};

export const MastheadPub = ({ pub }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const { id, endDate, startDate, pubType, mediaFiles, domainName, targetURL } = pub;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaFiles.length);
        }, 5000); // 🔄 Change de bannière toutes les 5 secondes

        return () => clearInterval(interval);
    }, [mediaFiles]);

    const {
        handleClosePost,
        handleReportPost,
        handleShareAd,
        handleCopyLink,
        handleReportWithReason
    } = useBusinessPostActions(pub, setShowMenu, setShowReportModal);

    // Gestion du menu
    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu((prev) => !prev);
    };

    const reportReasons = [
        {
            id: 1,
            label: 'Contenu inapproprié',
            icon: faBan,
            action: () => handleReportWithReason(pub.id, 'Contenu inapproprié')
        },
        {
            id: 2,
            label: 'Produit illégal',
            icon: faGavel,
            action: () => handleReportWithReason(pub.id, 'Produit illégal')
        },
        {
            id: 3,
            label: 'Annonce frauduleuse',
            icon: faExclamationTriangle,
            action: () => handleReportWithReason(pub.id, 'Annonce frauduleuse')
        },
        {
            id: 4,
            label: 'Violation des règles du site',
            icon: faBalanceScale,
            action: () => handleReportWithReason(pub.id, 'Violation des règles du site')
        },
        {
            id: 5,
            label: 'Produit contrefait',
            icon: faClone,
            action: () => handleReportWithReason(pub.id, 'Produit contrefait')
        },
        {
            id: 6,
            label: 'Informations trompeuses',
            icon: faQuestionCircle,
            action: () => handleReportWithReason(pub.id, 'Informations trompeuses')
        },
    ];

    const options = [
        {
            label: "Fermer l'annonce",
            icon: faTimes,
            action: () => handleClosePost(id),
        },
        {
            label: "Signaler l'annonce",
            icon: faFlag,
            action: () => handleReportPost(id),
        },
        {
            label: "Publicité sur AdsCity",
            icon: faBullhorn,
            action: () => handleShareAd(id),
        },
        {
            label: "Copier le lien",
            icon: faCopy,
            action: () => handleCopyLink(id),
        },
    ];

    if (!pub) return null;
    if (pubType !== 'masthead') return null;
    if (new Date(endDate) < new Date(startDate)) return null;
    if (new Date(startDate) > new Date()) return null;
    if (mediaFiles.length === 0) return null;


    return (
        <div
            key={id}
            className="masthead"
        >
            {mediaFiles.map((img, index) => (
                <div
                    key={index}
                    className={`banner-slide ${index === currentIndex ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${img})` }}
                    onClick={() => window.open(targetURL, '_blank')}
                />
            ))}

            {domainName ? <p className='domain-name'> {domainName} </p> : null}

            {/* Icons pour les actions */}
            <div className="card-actions">
                <button className="options-button" title="Plus d'options" onClick={toggleMenu}>
                    <FontAwesomeIcon icon={faEllipsisV} color='#343a40' />
                </button>
                <button className='badge-button'>
                    Sponsorisé
                </button>
            </div>
            <Menu options={options} isOpen={showMenu} onClose={() => setShowMenu(false)} />
            <Menu options={reportReasons} isOpen={showReportModal} onClose={() => setShowReportModal(false)} />
        </div>
    );
};

export const VideoInFeedPub = ({ pub }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const { id, endDate, startDate, title, description, callToAction, pubType, mediaFiles, targetURL } = pub;

    const {
        handleClosePost,
        handleReportPost,
        handleShareAd,
        handleCopyLink,
        handleReportWithReason
    } = useBusinessPostActions(pub, setShowMenu, setShowReportModal);

    // Gestion du menu
    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu((prev) => !prev);
    };

    const reportReasons = [
        {
            id: 1,
            label: 'Contenu inapproprié',
            icon: faBan,
            action: () => handleReportWithReason(pub.id, 'Contenu inapproprié')
        },
        {
            id: 2,
            label: 'Produit illégal',
            icon: faGavel,
            action: () => handleReportWithReason(pub.id, 'Produit illégal')
        },
        {
            id: 3,
            label: 'Annonce frauduleuse',
            icon: faExclamationTriangle,
            action: () => handleReportWithReason(pub.id, 'Annonce frauduleuse')
        },
        {
            id: 4,
            label: 'Violation des règles du site',
            icon: faBalanceScale,
            action: () => handleReportWithReason(pub.id, 'Violation des règles du site')
        },
        {
            id: 5,
            label: 'Produit contrefait',
            icon: faClone,
            action: () => handleReportWithReason(pub.id, 'Produit contrefait')
        },
        {
            id: 6,
            label: 'Informations trompeuses',
            icon: faQuestionCircle,
            action: () => handleReportWithReason(pub.id, 'Informations trompeuses')
        },
    ];

    const options = [
        {
            label: "Fermer l'annonce",
            icon: faTimes,
            action: () => handleClosePost(id),
        },
        {
            label: "Signaler l'annonce",
            icon: faFlag,
            action: () => handleReportPost(id),
        },
        {
            label: "Publicité sur AdsCity",
            icon: faBullhorn,
            action: () => handleShareAd(id),
        },
        {
            label: "Copier le lien",
            icon: faCopy,
            action: () => handleCopyLink(id),
        },
    ];

    if (pubType !== 'video-in-feed') return null;
    if (new Date(endDate) < new Date(startDate)) return null;
    if (new Date(startDate) > new Date()) return null;
    if (mediaFiles.length === 0) return null;


    return (
        <div className="video-in-feed" onClick={() => window.open(targetURL, '_blank')}>
            <video
                className="card-video"
                autoPlay
                muted
                loop
            >
                <source src={mediaFiles[0]} type="video/mp4" />
            </video>

            {/* Contenu de l'annonce */}
            <div className="card-content">
                <h2 className="card-title" title={`${title}`}>
                    {title?.length > 50
                        ? `${title.substring(0, 50)}...`
                        : title
                    }
                </h2>

                <p className="card-description">
                    {description?.length > 60
                        ? `${description.substring(0, 60)}...`
                        : description
                    }
                </p>

                <div className="card-footer">
                    <p className="card-call_to_action">
                        {callToAction}
                    </p>
                </div>
            </div>

            {/* Icons pour les actions */}
            <div className="card-actions">
                <button className="options-button" title="Plus d'options" onClick={toggleMenu}>
                    <FontAwesomeIcon icon={faEllipsisV} color='#343a40' />
                </button>
                <button className='badge-button'>
                    Sponsorisé
                </button>
            </div>
            <Menu options={options} isOpen={showMenu} onClose={() => setShowMenu(false)} />
            <Menu options={reportReasons} isOpen={showReportModal} onClose={() => setShowReportModal(false)} />
        </div>
    );
};

export const NativeDisplayPub = ({ pub }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const { id, endDate, startDate, pubType, mediaFiles, domainName, title, description, callToAction, targetURL } = pub;

    const {
        handleClosePost,
        handleReportPost,
        handleShareAd,
        handleCopyLink,
        handleReportWithReason
    } = useBusinessPostActions(pub, setShowMenu, setShowReportModal);

    // Gestion du menu
    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu((prev) => !prev);
    };

    const reportReasons = [
        {
            id: 1,
            label: 'Contenu inapproprié',
            icon: faBan,
            action: () => handleReportWithReason(pub.id, 'Contenu inapproprié')
        },
        {
            id: 2,
            label: 'Produit illégal',
            icon: faGavel,
            action: () => handleReportWithReason(pub.id, 'Produit illégal')
        },
        {
            id: 3,
            label: 'Annonce frauduleuse',
            icon: faExclamationTriangle,
            action: () => handleReportWithReason(pub.id, 'Annonce frauduleuse')
        },
        {
            id: 4,
            label: 'Violation des règles du site',
            icon: faBalanceScale,
            action: () => handleReportWithReason(pub.id, 'Violation des règles du site')
        },
        {
            id: 5,
            label: 'Produit contrefait',
            icon: faClone,
            action: () => handleReportWithReason(pub.id, 'Produit contrefait')
        },
        {
            id: 6,
            label: 'Informations trompeuses',
            icon: faQuestionCircle,
            action: () => handleReportWithReason(pub.id, 'Informations trompeuses')
        },
    ];

    const options = [
        {
            label: "Fermer l'annonce",
            icon: faTimes,
            action: () => handleClosePost(id),
        },
        {
            label: "Signaler l'annonce",
            icon: faFlag,
            action: () => handleReportPost(id),
        },
        {
            label: "Publicité sur AdsCity",
            icon: faBullhorn,
            action: () => handleShareAd(id),
        },
        {
            label: "Copier le lien",
            icon: faCopy,
            action: () => handleCopyLink(id),
        },
    ];

    if (pubType !== 'native-display') return null;
    if (new Date(endDate) < new Date(startDate)) return null;
    if (new Date(startDate) > new Date()) return null;
    if (mediaFiles.length === 0) return null;

    return (
        <div key={id} className="native-display" onClick={() => window.open(targetURL, '_blank')}>
            {mediaFiles && mediaFiles.length > 0 &&
                <div>
                    <img
                        src={mediaFiles[0]}
                        alt={title}
                        className="card-image"
                    />
                </div>
            }

            {/* Contenu de l'annonce */}
            <div className="card-content">
                <h2 className="card-title" title={`${title}`}>
                    {title?.length > 50
                        ? `${title.substring(0, 50)}...`
                        : title
                    }
                </h2>

                <p className="card-description">
                    {description?.length > 60
                        ? `${description.substring(0, 60)}...`
                        : description
                    }
                </p>

                <div className="card-footer">
                    <p className="card-call_to_action">
                        {callToAction}
                    </p>

                    {domainName ? <p className='domain-name'> {domainName} </p> : null}
                </div>
            </div>

            {/* Icons pour les actions */}
            <div className="card-actions">
                <button className="options-button" title="Plus d'options" onClick={toggleMenu}>
                    <FontAwesomeIcon icon={faEllipsisV} color='#343a40' />
                </button>
                <button className='badge-button'>
                    Sponsorisé
                </button>
            </div>
            <Menu options={options} isOpen={showMenu} onClose={() => setShowMenu(false)} />
            <Menu options={reportReasons} isOpen={showReportModal} onClose={() => setShowReportModal(false)} />
        </div>
    );
};
