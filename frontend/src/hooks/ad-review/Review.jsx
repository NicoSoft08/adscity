import React, { useState } from 'react';
import Modal from '../../customs/Modal';
import Spinner from '../../customs/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import data from '../../json/data.json';
import './Review.scss';
import FormData from '../FormData';

export default function Review({ formData, onBack, onSubmit, isLoading }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => setIsOpen(false);

    const handleSubmit = () => {
        onSubmit();
        handleClose();
    }

    const formatCategorization = () => {
        let category = "";
        let subcategory = "";
    
        if (formData.category) {
            const categoryData = data.categories.find(cat => cat.categoryName === formData.category);
            if (categoryData) category = categoryData.categoryTitles.fr;
        }
    
        if (formData.subcategory) {
            const categoryData = data.categories.find(cat => cat.categoryName === formData.category);
            if (categoryData) {
                const subcategoryData = categoryData.container.find(subcat => subcat.sousCategoryName === formData.subcategory);
                if (subcategoryData) subcategory = subcategoryData.sousCategoryTitles.fr;
            }
        }
    
        return { category, subcategory };
    };
    
    const { category, subcategory } = formatCategorization();

    return (
        <div className="ad-review">
            <div className="review-section">
                <h3>Catégorisation</h3>
                <p>Catégorie: {category}</p>
                <p>Sous-catégorie: {subcategory}</p>
            </div>

            <div className="review-section">
                <h3>Détails de l'annonce</h3>
                <p>Titre: {formData.details?.title}</p>
                <p>Description: {formData.details?.description}</p>

                <FormData details={formData.details} />

                <p>Type de Prix: {formData.details?.price_type}</p>
                <p>Prix: {formData.details?.price} RUB</p>
            </div>

            <div className="review-section">
                <h3>Emplacement</h3>
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
                    <FontAwesomeIcon icon={faPaperPlane} />
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
