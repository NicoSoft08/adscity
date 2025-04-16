import React, { useState, useRef, useEffect } from 'react';
import { faCircleXmark, faCloudUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Toast from '../../customs/Toast';
import { uploadImage } from '../../routes/storageRoutes';
import './ImageUpload.scss';

const MAX_FILE_SIZE_MB = 5; // 5MB maximum file size

export default function ImageUpload({ onNext, onBack, formData, setFormData, userData, currentUser }) {
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!currentUser || !currentUser.uid) {
            setToast({
                show: true,
                message: "Vous devez être connecté pour télécharger des images.",
                type: 'error'
            });
            // Optionally redirect to login page
        }
    }, [currentUser]);

    const getUserPlanMaxPhotos = () => {
        if (!userData?.plans) return 3;
        const userPlan = Object.values(userData.plans).find(plan => plan.max_photos !== undefined);
        return userPlan ? userPlan.max_photos : 3;
    };

    // Function to validate file size
    const validateFileSize = (file) => {
        const fileSizeMB = file.size / (1024 * 1024);
        return fileSizeMB <= MAX_FILE_SIZE_MB;
    };

    // Function to validate file types
    const validateFile = (file) => {
        // Define allowed extensions
        const allowedExtensions = ['jpg', 'jpeg', 'png'];
        const allowedMimeTypes = ['image/jpeg', 'image/png'];

        // Get file extension
        const fileExtension = file.name.split('.').pop().toLowerCase();

        // Check extension and MIME type
        const isValidType = allowedExtensions.includes(fileExtension) && allowedMimeTypes.includes(file.type);

        // Check file size
        const isValidSize = validateFileSize(file);

        return {
            isValid: isValidType && isValidSize,
            reason: !isValidType ? 'type' : !isValidSize ? 'size' : null
        };
    };

    const sanitizeFileName = (fileName) => {
        // Remove special characters and spaces
        return fileName
            .replace(/[^\w\s.-]/g, '')
            .replace(/\s+/g, '-')
            .toLowerCase();
    };

    const handleImageUpload = async (filesArray) => {
        if (!filesArray || filesArray.length === 0) return;

        // Validate files
        const validationResults = filesArray.map(file => ({
            file,
            validation: validateFile(file)
        }));

        // Filter out invalid file types
        const validFiles = validationResults
            .filter(item => item.validation.isValid)
            .map(item => item.file);
        const invalidTypeCount = validationResults.filter(item => item.validation.reason === 'type').length;

        const invalidSizeCount = validationResults.filter(item => item.validation.reason === 'size').length;

        // Show appropriate error messages
        if (invalidTypeCount > 0) {
            setToast({
                show: true,
                message: `${invalidTypeCount} fichier(s) rejeté(s). Seuls les formats JPG, JPEG, PNG et WEBP sont acceptés.`,
                type: 'error'
            });
        }

        if (invalidSizeCount > 0) {
            setToast({
                show: true,
                message: `${invalidSizeCount} fichier(s) rejeté(s). La taille maximum est de ${MAX_FILE_SIZE_MB}MB par image.`,
                type: 'error'
            });
        }

        if (validFiles.length === 0) return;

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
            const uploadPromises = validFiles.map(file => {
                const sanitizedName = sanitizeFileName(file.name);
                const sanitizedFile = new File([file], sanitizedName, { type: file.type });
                return uploadImage(sanitizedFile, userID);
            })
            const results = await Promise.all(uploadPromises);

            const uploadedImages = results.filter(res => res.success).map(res => res.imageUrl);
            if (uploadedImages.length) {
                const newImages = [...currentImages, ...uploadedImages].slice(0, maxPhotos);
                setFormData(prev => ({ ...prev, images: newImages }));
                setToast({ show: true, message: `${uploadedImages.length} image(s) téléchargée(s) avec succès !`, type: 'success' });
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
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
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
