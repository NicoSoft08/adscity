import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBullhorn, faCopy, faEllipsisV, faFlag } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Menu from '../../customs/Menu';
import { useBusinessPostActions } from '../../helpers/useHooks';
import './BusinessPost.scss';

export default function BusinessPost({ post }) {
    const [showMenu, setShowMenu] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const { id, pubType, mediaFile, title, description, callToAction, targetURL, advertiserName, companyName } = post;

    const {
        handleClosePost,
        handleReportPost,
        handleShareAd,
        handleCopyLink
    } = useBusinessPostActions(post, setShowMenu, setShowReportModal);


    const handlePostClick = async (url) => {
        console.log(url)
    }

    // Gestion du menu
    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu((prev) => !prev);
    };

    const options = [
        {
            label: "Fermer l'annonce",
            icon: faTimes,
            action: () => handleClosePost(post.id),
        },
        {
            label: "Signaler l'annonce",
            icon: faFlag,
            action: () => handleReportPost(post.id),
        },
        {
            label: "Publicité sur AdsCity",
            icon: faBullhorn,
            action: () => handleShareAd(post.id),
        },
        {
            label: "Copier le lien",
            icon: faCopy,
            action: () => handleCopyLink(post.id),
        },
    ];

    if (pubType !== 'native') return null;

    return (
        <Link
            to={targetURL}
            target='_blank'
            rel='noopener noreferrer'
            onClick={() => handlePostClick(`${targetURL}`)}
            key={id}
            className='card-container'
        >
            {mediaFile &&
                <div>
                    <img
                        src={mediaFile}
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
                    {description}
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
        </Link>
    );
};