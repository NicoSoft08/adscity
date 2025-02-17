import React, { useState } from 'react';
import Modal from '../../customs/Modal';
import Spinner from '../../customs/Spinner';
import './AdReview.scss';

export default function AdReview({ formData, onBack, onSubmit, isLoading }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => setIsOpen(false);

    const handleSubmit = () => {
        onSubmit();
        handleClose();
    }


    const formatSpecialFeatures = (features) => {
        if (!features) return '';

        // If features is an array, join with commas
        if (Array.isArray(features)) {
            return features.join(', ');
        }

        // If features is an object, get selected values
        if (typeof features === 'object') {
            const selectedFeatures = Object.entries(features)
                .filter(([_, selected]) => selected)
                .map(([feature]) => feature);
            return selectedFeatures.join(', ');
        }

        return features;
    };

    return (
        <div className="ad-review">
            <div className="review-section">
                <h3>Catégorie et Sous-catégorie</h3>
                <p>Catégorie: {formData.category}</p>
                <p>Sous-catégorie: {formData.subcategory}</p>
            </div>

            <div className="review-section">
                <h3>Détails de l'annonce</h3>
                <p>Titre: {formData.adDetails?.title}</p>
                <p>Description: {formData.adDetails?.description}</p>
                {formData.adDetails.category !== undefined ? <p>Catégorie : {formData.adDetails.category}</p> : null}
                {formData.adDetails.brand !== undefined ? <p>Marque : {formData.adDetails.brand}</p> : null}
                {formData.adDetails.productName !== undefined ? <p>Nom du produit : {formData.adDetails.productName}</p> : null}
                {formData.adDetails.size !== undefined ? <p>Taille : {formData.adDetails.size}</p> : null}
                {formData.adDetails.materials !== undefined ? <p>Matériaux : {formatSpecialFeatures(formData.adDetails.materials)}</p> : null}

                {formData.adDetails.gender !== undefined ? <p>Genre : {formData.adDetails.gender}</p> : null}
                {formData.adDetails.stoneType !== undefined ? <p>Type de pierre : {formData.adDetails.stoneType}</p> : null}

                {formData.adDetails.volumeWeight !== undefined ? <p>Volume/Poids : {formData.adDetails.volumeWeight}</p> : null}

                {formData.adDetails.origin !== undefined ? <p>Origine : {formData.adDetails.origin}</p> : null}

                {formData.adDetails.make !== undefined ? <p>Marque : {formData.adDetails.make}</p> : null}
                {formData.adDetails.model !== undefined ? <p>Modèle : {formData.adDetails.model}</p> : null}
                {formData.adDetails.color !== undefined ? <p>Couleur : {formData.adDetails.color}</p> : null}
                {formData.adDetails.connectivity !== undefined ? <p>Connectivité : {formatSpecialFeatures(formData.adDetails.connectivity)}</p> : null}
                {formData.adDetails.storageCapacity !== undefined ? <p>Capacité de stockage : {formData.adDetails.storageCapacity}</p> : null}
                {formData.adDetails.operatingSystem !== undefined ? <p>Système d'exploitation : {formData.adDetails.operatingSystem}</p> : null}
                {formData.adDetails.condition !== undefined ? <p>Condition : {formData.adDetails.condition}</p> : null}
                <p>Type de Prix: {formData.adDetails?.priceType}</p>
                <p>Prix: {formData.adDetails?.price} RUB</p>


            </div>

            <div className="review-section">
                <h3>Localisation</h3>
                <p>Pays: {formData.location?.country}</p>
                <p>Ville: {formData.location?.city}</p>
                <p>Adresse: {formData.location?.address}</p>
            </div>

            <div className="review-section">
                <h3>Photos</h3>
                <div className="image-grid">
                    {formData.images && formData.images.length > 0 ? (
                        formData.images.flat().map((image, index) => (
                            <img src={image} alt={`photo-${index}`} key={index} className="review-image" />
                        ))
                    ) : (
                        <p>Aucune photo ajoutée.</p>
                    )}
                </div>
            </div>


            <div className="form-navigation">
                <button className="back-button" onClick={onBack}>
                    Retour
                </button>
                <button className="next-button" onClick={() => setIsOpen(true)}>
                    Soumettre
                </button>
            </div>


            <Modal
                title={"Publication"}
                isNext={true}
                isHide={false}
                onNext={handleSubmit}
                hideText={"Non"}
                nextText={isLoading ? <Spinner /> : "Publier"}
                onShow={isOpen}
                onHide={handleClose}
            >
                <p>Il n'y a pas de retour en arrière. Êtes-vous sûr de vouloir publier cette annonce ?</p>
            </Modal>
        </div>
    );
};
