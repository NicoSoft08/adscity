import React, { useState } from 'react';
import Modal from '../../customs/Modal';
import Spinner from '../../customs/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import data from '../../json/data.json';
import FormData from '../FormData';
import ReCAPTCHA from 'react-google-recaptcha';
import './Review.scss';

export default function Review({ formData, onBack, onSubmit, isLoading }) {
    const [isOpen, setIsOpen] = useState(false);
    const [captchaValue, setCaptchaValue] = useState(null);
    const [errors, setErrors] = useState({ captcha: '' });

    // Replace with your actual reCAPTCHA site key
    const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

    const handleClose = () => setIsOpen(false);

    const handleCaptchaChange = (value) => {
        setCaptchaValue(value);
        // Clear captcha error if it exists
        if (errors.captcha) {
            setErrors({
                ...errors,
                captcha: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!captchaValue) {
            newErrors.captcha = "Veuillez confirmer que vous n'êtes pas un robot";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit(captchaValue);
            handleClose();
        }
    };

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
                    {formData.images && formData.images?.length > 0 ? (
                        formData.images.flat().map((image, index) => (
                            <img src={image} alt={`photo-${index}`} key={index} className="review-image" />
                        ))
                    ) : (
                        <p>Aucune photo ajoutée.</p>
                    )}
                </div>
            </div>

            {/* reCAPTCHA component */}
            <div className="captcha-container">
                <ReCAPTCHA
                    sitekey={RECAPTCHA_SITE_KEY}
                    onChange={handleCaptchaChange}
                />
            </div>
            {errors.captcha && <div className="error-text">{errors.captcha}</div>}


            <div className="form-navigation">
                <button className="back-button" onClick={onBack}>
                    Retour
                </button>
                <button
                    className="next-button"
                    onClick={() => {
                        // First check if CAPTCHA is completed
                        if (!captchaValue) {
                            setErrors({
                                ...errors,
                                captcha: "Veuillez confirmer que vous n'êtes pas un robot"
                            });
                            // Scroll to the CAPTCHA to make the error visible
                            document.querySelector('.captcha-container')?.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center'
                            });
                        } else {
                            // CAPTCHA is valid, open the modal
                            setIsOpen(true);
                        }
                    }}
                    aria-label="Publier l'annonce"
                >
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
