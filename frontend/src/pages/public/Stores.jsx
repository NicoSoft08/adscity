import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import '../../styles/Stores.scss';

const StoreItem = ({ item, index }) => {
    return (
        <div key={index} className="store-item">

            {/* Image de couverture */}
            <div className="store-cover">
                <img src={item.coverURL} alt={`Cover Boutique ${index + 1}`} />
            </div>

            {/* Infos Boutique */}
            <div className="store-details">
                <div className="owner-info">
                    <img
                        src={item.profilURL}
                        alt="Owner Profile"
                        className="owner-avatar"
                    />
                    <div className="owner-text">
                        <h3>{item.shopName}</h3>
                        <span className="profile-type">{item.shopCategory}</span>
                    </div>
                </div>

                {/* Bouton Like */}
                <button className="like-button">
                    <FontAwesomeIcon icon={faThumbsUp} />
                    J'aime
                </button>
            </div>
        </div>
    )
}

export default function Stores() {
    return (
        <div className='stores'>           
            <div className="stores-content">
                <div>
                    <h2>Bienvenue dans l'annuaire des boutiques !</h2>
                    <div className="stores-container">
                        {Array.from(Array(20).fill(null)).map((_, index) => (
                            <StoreItem key={index} item={{
                                coverURL: "https://picsum.photos/seed/picsum/200/300",
                                profilURL: "https://picsum.photos/seed/picsum/200/300",
                                shopName: "Nom de la boutique",
                                shopCategory: "Catégorie de la boutique"
                            }} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
