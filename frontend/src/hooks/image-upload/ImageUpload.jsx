import React, { useState } from 'react';
import { faCirclePlus, faCircleXmark, faCloudUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Toast from '../../customs/Toast';
import './ImageUpload.scss';

export default function ImageUpload({ onNext, onBack, onChange, userData, selectedImages, handleRemoveImage }) {
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const validateImages = () => {
        if (!selectedImages.some(img => img !== null)) {
            setToast({ type: 'error', message: 'Veuillez télécharger au moins une image.', show: true });
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (validateImages()) {
            onNext();
        }
    };

    const getUserPlanMaxPhotos = () => {
        if (!userData?.plans) return 3;
        const userPlan = Object.values(userData.plans).find(plan => plan.max_photos !== undefined);
        return userPlan ? userPlan.max_photos : 3;
    };

    return (
        <div className="image-upload-form">
            <div className="image-uploader">
                <div className="upload-area">
                    <FontAwesomeIcon icon={faCloudUpload} className="upload-icon" />
                    <label htmlFor="upload-input" className="upload-button">Télécharger des Images</label>
                </div>

                <div className="image-upload-grid">
                    {[...Array(getUserPlanMaxPhotos())].map((_, index) => (
                        <div className="image-upload-box" key={index}>
                            {selectedImages[index] ? (
                                <div className="image-container">
                                    <img src={selectedImages[index]} alt={`upload-${index}`} className="uploaded-image" />
                                    <FontAwesomeIcon 
                                        icon={faCircleXmark} 
                                        className="remove-icon" 
                                        onClick={() => handleRemoveImage(index)} 
                                    />
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
                                onChange={(e) => onChange(e, index)} 
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="form-navigation">
                <button className="back-button" onClick={onBack}>Retour</button>
                <button className="next-button" onClick={handleNext}>Suivant</button>
            </div>

            <Toast type={toast.type} message={toast.message} show={toast.show} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
}