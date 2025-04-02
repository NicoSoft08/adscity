import React, { useState, useRef } from 'react';
import { faCircleXmark, faCloudUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Toast from '../../customs/Toast';
import './ImageUpload.scss';
import { uploadImage } from '../../routes/storageRoutes';

export default function ImageUpload({ onNext, onBack, formData, setFormData, userData, currentUser }) {
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const getUserPlanMaxPhotos = () => {
        if (!userData?.plans) return 3;
        const userPlan = Object.values(userData.plans).find(plan => plan.max_photos !== undefined);
        return userPlan ? userPlan.max_photos : 3;
    };

    const handleImageUpload = async (filesArray) => {
        if (!filesArray || filesArray.length === 0) return;

        const maxPhotos = getUserPlanMaxPhotos();
        const currentImages = formData.images || [];
        if (currentImages.length + filesArray.length > maxPhotos) {
            setToast({ show: true, message: `Maximum ${maxPhotos} images autorisées.`, type: 'error' });
            return;
        }

        setIsUploading(true);
        setToast({ show: true, message: 'Téléchargement en cours...', type: 'info' });

        try {
            const userID = currentUser?.uid;
            const uploadPromises = filesArray.map(file => uploadImage(file, userID));
            const results = await Promise.all(uploadPromises);

            const uploadedImages = results.filter(res => res.success).map(res => res.imageUrl);
            if (uploadedImages.length) {
                const newImages = [...currentImages, ...uploadedImages].slice(0, maxPhotos);
                setFormData(prev => ({ ...prev, images: newImages }));
                setToast({ show: true, message: 'Images téléchargées avec succès !', type: 'success' });
            } else {
                setToast({ show: true, message: 'Échec du téléchargement.', type: 'error' });
            }
        } catch (error) {
            console.error("Erreur lors de l'upload :", error);
            setToast({ show: true, message: 'Une erreur est survenue.', type: 'error' });
        }

        setIsUploading(false);
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        handleImageUpload(files);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        handleImageUpload(files);
    };

    const handleRemoveImage = (index) => {
        setFormData(prev => {
            const updatedImages = [...prev.images];
            updatedImages.splice(index, 1);
            return { ...prev, images: updatedImages };
        });
    };

    const handleNext = () => {
        if (!formData.images || formData.images.length === 0) {
            setToast({ type: 'error', message: 'Veuillez télécharger au moins une image.', show: true });
            return;
        }
        onNext();
    };

    return (
        <div className="image-upload-form">
            <div className="upload-instructions">
                Cliquez ou glissez jusqu'à {getUserPlanMaxPhotos()} images
            </div>

            <div 
                className={`upload-area ${isUploading ? 'uploading' : ''}`} 
                onClick={() => fileInputRef.current.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                tabIndex={0} 
                role="button"
                onKeyPress={(e) => e.key === 'Enter' && fileInputRef.current.click()}
            >
                <FontAwesomeIcon icon={faCloudUpload} className="upload-icon" />
                <p className="upload-text">{isUploading ? 'Téléchargement...' : 'Cliquez ou glissez vos images ici'}</p>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileSelect}
                />
            </div>

            <div className="image-upload-grid">
                {formData.images && formData.images.map((image, index) => (
                    <div className="image-container" key={index}>
                        <img src={image} alt={`upload-${index}`} className="uploaded-image" />
                        <FontAwesomeIcon
                            icon={faCircleXmark}
                            className="remove-icon"
                            onClick={() => handleRemoveImage(index)}
                        />
                    </div>
                ))}
            </div>

            <div className="form-navigation">
                <button className="back-button" onClick={onBack}>Retour</button>
                <button className="next-button" onClick={handleNext} disabled={isUploading}>Suivant</button>
            </div>

            {toast.show && <Toast type={toast.type} message={toast.message} show={toast.show} onClose={() => setToast({ show: false })} />}
        </div>
    );
}
