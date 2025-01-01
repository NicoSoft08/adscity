import React, { useState } from 'react';
import { faCirclePlus, faCircleXmark, faCloudUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { uploadImage } from '../../services/storageServices';
import Toast from '../../customs/Toast';
import './ImageUpload.scss';

export default function ImageUpload({ onNext, onBack, onChange, formData, currentUser, userData }) {
    const [selectedImages, setSelectedImages] = useState(formData.images || []);
    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: '',
    });

    const hideToast = () => {
        setToast({
            ...toast,
            show: false,
        });
    };


    const handleImageChange = async (index, e) => {
        const file = e.target.files[0];
        const userID = currentUser?.uid;

        if (file) {
            const newImages = [...selectedImages];
            newImages[index] = URL.createObjectURL(file);
            setSelectedImages(newImages);

            const result = await uploadImage(file, userID);

            if (result.success) {
                setToast({
                    show: true,
                    message: result.message,
                    type: 'success',
                });

                const { imageUrl } = result;

                // Remplacer l'URL temporaire de l'image avec l'URL reçue du serveur
                const updatedImages = [...newImages];
                updatedImages[index] = imageUrl; // Remplacer l'image à l'index avec l'URL du serveur
                setSelectedImages(updatedImages);

                // Mettre à jour formData avec toutes les images correctement ordonnées
                onChange({
                    ...formData,
                    images: updatedImages, // Utiliser la liste mise à jour des images
                });

                setToast({
                    type: 'info',
                    message: 'Image ajoutée au formulaire !',
                    show: true,
                });
            } else {
                setToast({
                    show: true,
                    message: result.message,
                    type: 'error',
                });
            }
        }
    };


    const validateImages = () => {
        const hasImages = selectedImages.some((img) => img !== null);
        if (!hasImages) {
            setToast({
                type: 'error',
                message: 'Veuillez télécharger au moins une image.',
                show: true,
            });
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (validateImages()) {
            onNext();
        }
    };


    const handleRemoveImage = (index) => {
        const newImages = [...selectedImages];
        newImages[index] = null; // Remplacer l'image par null (case vide)
        setSelectedImages(newImages);

        // Mettre à jour le formData sans cette image
        const updatedFormData = {
            ...formData,
            images: newImages,
        };
        onChange(updatedFormData);
    };

    const getUserPlanMaxPhotos = (userData) => {
        if (!userData || !userData.plans) {
            return null; // Retourne null si les données utilisateur ou les plans sont absents
        }

        // Recherche d'un plan contenant la propriété 'max_photos'
        const userPlan = Object.keys(userData.plans).find(plan =>
            userData.plans[plan]?.max_photos !== undefined
        );

        // Si un plan valide est trouvé, retourne le nombre maximal de photos
        return userPlan ? userData.plans[userPlan].max_photos : null;
    };

    return (
        <div className="image-upload-form">
            <div className="image-uploader">
                {/* Zone de Drag & Drop */}
                <div className="upload-area">
                    <FontAwesomeIcon icon={faCloudUpload} className="upload-icon" />
                    <label htmlFor="upload-input" className="upload-button">Télécharger des Images</label>
                </div>

                {/* 5 Rectangles pour les images */}
                <div className="image-upload-grid">
                    {userData && [...Array(getUserPlanMaxPhotos(userData))].map((_, index) => (
                        <div className="image-upload-box" key={index}>
                            {selectedImages[index] ? (
                                <div className="image-container">
                                    <img src={selectedImages[index]} alt={`upload-${index}`} className="uploaded-image" />
                                    <FontAwesomeIcon icon={faCircleXmark} className="remove-icon" onClick={() => handleRemoveImage(index)} />
                                </div>
                            ) : (
                                <label htmlFor={`image-input-${index}`} className="image-placeholder">
                                    <FontAwesomeIcon icon={faCirclePlus} className="plus-icon" size="2x" />
                                </label>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                id={`image-input-${index}`}
                                style={{ display: 'none' }}
                                onChange={(e) => handleImageChange(index, e)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="form-navigation">
                <button className="back-button" onClick={onBack}>
                    Retour
                </button>
                <button className="next-button" onClick={handleNext}>
                    Suivant
                </button>
            </div>

            <Toast
                type={toast.type}
                message={toast.message}
                show={toast.show}
                onClose={hideToast}
            />
        </div>
    );
};
