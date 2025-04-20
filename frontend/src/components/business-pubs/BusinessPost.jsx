import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faClose } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './BusinessPost.css';

export default function BusinessPost ({ post }) {
    const [isHidden, setIsHidden] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        id, mediaUrl, title, description, link, contact, domainName, companyName } = post;

    const handleOpenModal = () => {
        console.log('open modal');
        setIsModalOpen(!isModalOpen);
    };

    const handleCopyLinkToClipboard = () => {
        navigator.clipboard.writeText(link).then(() => {
            console.log('Link copied to clipboard');
        }).catch((err) => {
            console.log('Error copying link: ', err);
        });
    };

    const handleHideAd = () => {
        setIsHidden(false);
    };

    return (
        <>
            {isHidden && (
                <div key={id} className='ad-container'>
                    <>
                        {!isModalOpen ? (
                            <>
                                <a href={link} target='_blank' rel='noopener noreferrer'>
                                    <div className="ad-image-container">
                                        <img className='ad-image' src={mediaUrl} alt='Advertisement' />
                                    </div>
                                    <div className='ad-info'>
                                        <p className='ad-title'>{title}</p>
                                        <p className='ad-description'>{description}</p>
                                    </div>
                                    <div className='ad-footer'>
                                        {domainName ? <sub className='ad-domain-name'>{domainName}</sub> : null}
                                    </div>
                                </a>
                            </>
                        ) : (
                            <>
                                <div className='ad-modal-container'>
                                    <div className="ad-header">
                                        <h4>Companie: {companyName}</h4>
                                        <p>Responsable: <strong>{contact.f_name + ' ' + contact.l_name}</strong></p>
                                    </div>
                                    <div className="ad-links">
                                        <span><Link onClick={handleHideAd}>Fermer l'annonce</Link></span>
                                        <span><Link to={'/advertising'}>Publicité sur AdsCity</Link></span>
                                        <span><Link onClick={handleCopyLinkToClipboard}>Copier le lien</Link></span>
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="ad-insigne">
                            <p className='ad-pub'>Publicité</p>
                            {isModalOpen ?
                                <FontAwesomeIcon icon={faClose} className='three-dots' onClick={handleOpenModal} />
                                :
                                <FontAwesomeIcon icon={faEllipsis} className='three-dots' onClick={handleOpenModal} />
                            }
                        </div>
                    </>
                </div>
            )}
        </>
    );
};