import { logEvent } from 'firebase/analytics';
import React, { useEffect, useState } from 'react';
import { analytics } from '../firebaseConfig';

import '../styles/StatusItem.scss';

export default function StatusItem({ id, media, frontImage, title, handleStatusClick }) {
    const [showModal, setShowModal] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isViewed, setIsViewed] = useState(false);

    useEffect(() => {
        const viewedStatus = JSON.parse(localStorage.getItem('viewedStatus')) || {};
        if (viewedStatus[id]) {
            setIsViewed(true);
        } else {
            setIsViewed(false);
        }
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === media.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, [id, media.length]); // Reset interval when currentIndex changes

    const logStatusViewedEvent = (id) => {
        logEvent(analytics, 'view_promotion', { page_path: window.location.pathname });
        const viewedStatus = JSON.parse(localStorage.getItem('viewedStatus')) || {};
        viewedStatus[id] = true;
        localStorage.setItem('viewedStatus', JSON.stringify(viewedStatus));
    }

    const handleModalClose = () => {
        setShowModal(false);
    };

    return (
        <div className="status-container">
            <div className="status-list">
                <div
                    key={id}
                    className="status-item"
                    onClick={() => {
                        handleStatusClick(id);
                        setShowModal(true);
                        setIsViewed(true);
                        logStatusViewedEvent(id);
                        console.log('media: ', media)
                    }}
                >
                    <div
                        className={`status-image-container ${isViewed ? 'viewed' : 'unviewed'}`}
                    >
                        <img src={frontImage} alt={title} className="status-image" />
                    </div>
                    <span className="user-name">{title}</span>
                </div>
            </div>
            {showModal && (
                <div className="status-modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={handleModalClose}>
                            &times;
                        </span>
                        <div className="media-container">
                            <div className="progress-indicator">
                                {media.map((_, index) => (
                                    <div key={index} className={index === currentIndex ? 'active' : ''}></div>

                                ))}
                            </div>
                            <div className="flex-align">
                                <div className="media-item">
                                    {media[currentIndex].type === 'image' ? (
                                        <img src={media[currentIndex].src} alt="Sliding Media" />
                                    ) : (
                                        <video loop muted autoPlay="autoplay">
                                            <source src={media[currentIndex].src} type="video/mp4" />
                                        </video>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
