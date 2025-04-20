import React from 'react';
import '../../styles/PostTypeSelection.scss';

export default function PostTypeSelection({ postType, setPostType, nextStep }) {

    const handleSelectPostType = (type) => {
        setPostType(type);
        nextStep();
    };

    return (
        <div className="post-type-selection">
            <h2>Quel type d'annonce souhaitez-vous publier ?</h2>
            <div className="post-type-buttons">
                <button
                    className={postType === 'sell' ? 'active' : ''}
                    onClick={() => handleSelectPostType('sell')}
                >
                    Vente
                </button>
                <button
                    className={postType === 'rent' ? 'active' : ''}
                    onClick={() => handleSelectPostType('rent')}
                >
                    Location
                </button>
                <button
                    className={postType === 'exchange' ? 'active' : ''}
                    onClick={() => handleSelectPostType('exchange')}
                >
                    Échange
                </button>
                <button
                    className={postType === 'service' ? 'active' : ''}
                    onClick={() => handleSelectPostType('service')}
                >
                    Service
                </button>
            </div>
        </div>
    );
};
