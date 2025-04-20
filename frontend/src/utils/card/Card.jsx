import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProfileByUserID } from '../../routes/storageRoutes';
import { incrementClickCount, incrementViewCount, updateInteraction } from '../../routes/apiRoutes';
import { toggleFavorites } from '../../routes/userRoutes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faEllipsis } from '@fortawesome/free-solid-svg-icons';

export default function Card({ post, onToggleFavorite }) {
    const { currentUser, userData } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [profilURL, setProfilURL] = useState(null);
    const [isHidden, setIsHidden] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        id, userID, adDetails, images, location, category, subcategory, views, isActive, moderated_at, isSold,
        mediaFile, title, description, callToAction, targetURL, advertiserName, domainName, companyName
    } = post;

    const isBusinessAd = advertiserName && companyName;

    useEffect(() => {
        if (currentUser && userData.adsSaved?.includes(post.id)) {
            setIsFavorite(true);
        }

        const fetchProfilURL = async () => {
            try {
                const response = await fetchProfileByUserID(userID);
                setProfilURL(response?.profilURL || null);
            } catch (error) {
                console.error("Erreur lors de la récupération du profil :", error);
                setProfilURL(null);
            }
        };

        if (userID) {
            fetchProfilURL();
        }
    }, [userID, currentUser, userData, post]);

    const handleOpenModal = () => setIsModalOpen(!isModalOpen);
    const handleHideAd = () => setIsHidden(false);
    const handleCopyLinkToClipboard = () => {
        navigator.clipboard.writeText(targetURL).then(() => {
            setToast({ show: true, type: 'success', message: 'Lien copié dans le presse-papiers !' });
        }).catch((err) => console.error('Erreur de copie :', err));
    };

    const handleReportAd = (postID) => {
        setShowReportModal(true);
        setShowMenu(false);
    };

    const handleShareAd = async (postID) => {
        const postUrl = `${window.location.origin}/post/${postID}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Découvrez cette annonce sur AdsCity !",
                    text: "Jetez un œil à cette annonce, ça pourrait vous intéresser.",
                    url: postUrl,
                });
                setToast({ show: true, type: 'success', message: 'Annonce partagée avec succès.' });
            } catch (error) {
                console.error('Erreur de partage :', error);
                setToast({ show: true, type: 'error', message: 'Erreur lors du partage.' });
            }
        } else {
            navigator.clipboard.writeText(postUrl).then(() => {
                setToast({ show: true, type: 'success', message: 'Lien copié dans le presse-papiers.' });
            }).catch(err => setToast({ show: true, type: 'error', message: 'Erreur lors de la copie du lien.' }));
        }
    };

    const handlePostClick = async (url) => {
        if (isBusinessAd) {
            window.open(targetURL, '_blank');
        } else {
            navigate(url);
            if (currentUser) {
                await updateInteraction(id, currentUser.uid, category);
                await incrementViewCount(id);
                await incrementClickCount(id);
            }
        }
    };

    const handleToggleFavorite = async (postID) => {
        if (!currentUser) {
            setToast({ show: true, type: 'error', message: 'Connectez-vous pour ajouter aux favoris.' });
            return;
        }

        const result = await toggleFavorites(postID, currentUser.uid);
        setIsFavorite(result.isFavorite);
        setToast({
            show: true,
            type: result.isFavorite ? 'success' : 'info',
            message: result.isFavorite ? 'Ajouté aux favoris !' : 'Retiré des favoris.',
        });

        if (onToggleFavorite && !result.isFavorite) {
            onToggleFavorite(postID);
        }
    };

    if (!isHidden) return null;

    return (
        <div className={`ad-container ${isBusinessAd ? 'business-ad' : ''}`} key={id}>
            {isBusinessAd ? (
                <>
                    {!isModalOpen ? (
                        <a href={targetURL} target='_blank' rel='noopener noreferrer'>
                            <img className='ad-image' src={mediaFile} alt='Advertisement' />
                            <div className='ad-info'>
                                <p className='ad-title'>{title}</p>
                                <p className='ad-description'>{description}</p>
                                <div className="call-to-action">{callToAction}</div>
                            </div>
                            <div className='ad-footer'>{domainName && <sub className='ad-domain-name'>{domainName}</sub>}</div>
                        </a>
                    ) : (
                        <div className='ad-modal-container'>
                            <h4>Companie: {companyName}</h4>
                            <p>Responsable: <strong>{advertiserName}</strong></p>
                            <div className="ad-links">
                                <Link onClick={handleHideAd}>Fermer</Link>
                                <Link to={'/advertising'}>Publicité sur AdsCity</Link>
                                <Link onClick={handleCopyLinkToClipboard}>Copier le lien</Link>
                            </div>
                        </div>
                    )}
                    <FontAwesomeIcon icon={isModalOpen ? faClose : faEllipsis} className='three-dots' onClick={handleOpenModal} />
                </>
            ) : (
                <div className="card-content">
                    <p>{adDetails?.title}</p>
                    <p>{adDetails?.price} RUB</p>
                    <button onClick={() => handleToggleFavorite(id)}>{isFavorite ? '❤️' : '🤍'}</button>
                </div>
            )}
        </div>
    );
};
