import { faImages, faInfoCircle, faMapMarker, faTags } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { useState } from 'react';
import { formatSpecialFeatures } from '../func';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/Tab.scss';

export default function Tab({ pendingAd }) {
    const [activeTab, setActiveTab] = useState('category');

    const tabs = [
        { id: 'category', label: 'Catégorie', icon: faTags },
        { id: 'details', label: 'Détails', icon: faInfoCircle },
        { id: 'location', label: 'Localisation', icon: faMapMarker },
        { id: 'photos', label: 'Photos', icon: faImages }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'category':
                return (
                    <div className="tab-content">
                        <p>Catégorie: {pendingAd?.category}</p>
                        <p>Sous-catégorie: {pendingAd?.subcategory}</p>
                    </div>
                );
            case 'details':
                return (
                    <div className="tab-content">
                        <p>Titre: {pendingAd?.adDetails?.title}</p>
                        <p>Description: {pendingAd?.adDetails?.description}</p>
                        {pendingAd?.adDetails.category !== undefined ? <p>Catégorie : {pendingAd?.adDetails.category}</p> : null}
                        {pendingAd?.adDetails.brand !== undefined ? <p>Marque : {pendingAd?.adDetails.brand}</p> : null}
                        {pendingAd?.adDetails.productName !== undefined ? <p>Nom du produit : {pendingAd?.adDetails.productName}</p> : null}
                        {pendingAd?.adDetails.size !== undefined ? <p>Taille : {pendingAd?.adDetails.size}</p> : null}
                        {pendingAd?.adDetails.materials !== undefined ? <p>Matériaux : {formatSpecialFeatures(pendingAd?.adDetails.materials)}</p> : null}

                        {pendingAd?.adDetails.gender !== undefined ? <p>Genre : {pendingAd?.adDetails.gender}</p> : null}
                        {pendingAd?.adDetails.stoneType !== undefined ? <p>Type de pierre : {pendingAd?.adDetails.stoneType}</p> : null}

                        {pendingAd?.adDetails.volumeWeight !== undefined ? <p>Volume/Poids : {pendingAd?.adDetails.volumeWeight}</p> : null}

                        {pendingAd?.adDetails.origin !== undefined ? <p>Origine du produit : {pendingAd?.adDetails.origin}</p> : null}

                        {pendingAd.adDetails.serviceDuration !== undefined ? <p>Durée du service : {pendingAd.adDetails.serviceDuration}</p> : null}
                        {pendingAd.adDetails.additionalFeatures !== undefined ? <p>Caractéristiques supplémentaires : {formatSpecialFeatures(pendingAd.adDetails.additionalFeatures)}</p> : null}
                        {pendingAd.adDetails.availability !== undefined ? <p>Disponibilités : {pendingAd.adDetails.availability}</p> : null}
                        {pendingAd.adDetails.serviceType !== undefined ? <p>Type de service : {formatSpecialFeatures(pendingAd.adDetails.serviceType)}</p> : null}

                        {pendingAd?.adDetails.accessoryType !== undefined ? <p>Type d'accessoire : {pendingAd?.adDetails.accessoryType}</p> : null}
                        {pendingAd?.adDetails.compatibility !== undefined ? <p>Compatibilité : {pendingAd?.adDetails.compatibility}</p> : null}

                        {pendingAd.productType !== undefined ? <p>Type de produit : {pendingAd.productType}</p> : null}
                        {pendingAd.quantityAvailable !== undefined ? <p>Quantité disponible : {pendingAd.quantityAvailable}</p> : null}
                        {pendingAd.unitOfMeasure !== undefined ? <p>Unité de mesure : {pendingAd.unitOfMeasure}</p> : null}

                        {pendingAd?.adDetails.make !== undefined ? <p>Marque : {pendingAd?.adDetails.make}</p> : null}
                        {pendingAd?.adDetails.model !== undefined ? <p>Modèle : {pendingAd?.adDetails.model}</p> : null}
                        {pendingAd?.adDetails.color !== undefined ? <p>Couleur : {pendingAd?.adDetails.color}</p> : null}
                        {pendingAd?.adDetails.connectivity !== undefined ? <p>Connectivité : {formatSpecialFeatures(pendingAd?.adDetails.connectivity)}</p> : null}
                        {pendingAd?.adDetails.storageCapacity !== undefined ? <p>Capacité de stockage : {pendingAd?.adDetails.storageCapacity}</p> : null}
                        {pendingAd?.adDetails.operatingSystem !== undefined ? <p>Système d'exploitation : {pendingAd?.adDetails.operatingSystem}</p> : null}
                        {pendingAd?.adDetails.condition !== undefined ? <p>Condition : {pendingAd?.adDetails.condition}</p> : null}
                        <p>Type de Prix: {pendingAd?.adDetails?.priceType}</p>
                        {/* <p>Devise: {formData.adDetails?.currency}</p> */}
                        <p>Prix: {pendingAd?.adDetails?.price} RUB</p>
                        {/* Other details */}
                    </div>
                );
            case 'location':
                return (
                    <div className="tab-content">
                        <p>Pays: {pendingAd.location?.country}</p>
                        <p>Ville: {pendingAd.location?.city}</p>
                        <p>Adresse: {pendingAd.location?.address}</p>
                    </div>
                );
            case 'photos':
                return (
                    <div className="image-grid">
                        {pendingAd.images?.flat().map((image, index) => (
                            <img
                                src={image}
                                alt={`photo-${index}`}
                                key={index}
                                className="review-image"
                            />
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="ad-tabs">
            <div className="tabs-header">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <FontAwesomeIcon icon={tab.icon} />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
            <div className="tab-content-container">
                {renderContent()}
            </div>
        </div>
    );
};
