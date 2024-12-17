import React from 'react';
import imageCompression from 'browser-image-compression';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUpload, faPlus } from '@fortawesome/free-solid-svg-icons';
import { uploadFile } from '../../firebase/storage';
import '../../styles/ImageUpload.scss';


export default function ImageUpload({ images, setImages, nextStep, currentUser }) {


    const handleImageUpload = async (index, event) => {
        const file = event.target.files[0];
        const userID = currentUser?.uid;
        if (file) {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
            };

            try {
                // Compression de l'image
                const compressedFile = await imageCompression(file, options);

                // Création de l'URL locale pour la prévisualisation
                const localPreviewUrl = URL.createObjectURL(compressedFile);

                // Met à jour l'image localement avant l'upload
                const updatedImages = [...images];
                updatedImages[index] = localPreviewUrl;
                setImages(updatedImages);

                // Si 5 images sont sélectionnées, attendre 2 secondes puis appeler nextStep()
                if (updatedImages.filter(img => img !== null).length === 5) {
                    setTimeout(() => {
                        nextStep(); // Passe à l'étape suivante après un délai de 2 secondes
                    }, 2000);
                }

                // Upload de l'image dans Firebase Storage
                const uploadedImageUrl = await uploadFile(compressedFile, userID);

                // Met à jour l'image avec l'URL obtenue après l'upload sur Firebase
                updatedImages[index] = uploadedImageUrl;
                setImages(updatedImages);
            } catch (error) {
                console.error('Erreur lors de la compression ou de l\'upload de l\'image:', error);
            }
        }
    };

    return (
        <div className="image-uploader">
            {/* Zone de Drag & Drop */}
            <div className="upload-area">
                <FontAwesomeIcon icon={faCloudUpload} className="upload-icon" />
                <label htmlFor="upload-input" className="upload-button">Télécharger des Images</label>
            </div>

            {/* 5 Rectangles pour les images */}
            <div className="image-upload-grid">
                {images.map((image, index) => (
                    <div className="image-upload-box" key={index}>
                        {image ? (
                            <img src={image} alt={`upload-${index}`} className="uploaded-image" />
                        ) : (
                            <label htmlFor={`image-input-${index}`} className="image-placeholder">
                                <FontAwesomeIcon icon={faPlus} className="plus-icon" size={32} />
                            </label>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            id={`image-input-${index}`}
                            style={{ display: 'none' }}
                            onChange={(e) => handleImageUpload(index, e)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
