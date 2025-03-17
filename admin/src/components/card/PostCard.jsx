import React, { useState } from 'react';
import Toast from '../../customs/Toast';
import '../../styles/PostCard.scss';
import { deletePostImagesFromStorage } from '../../routes/storageRoutes';
import { deletePost } from '../../routes/postRoutes';

const ImageGallery = ({ images = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (images.length === 0) {
        return <p>Aucune image disponible.</p>;
    }

    // 🔹 Aller à l'image suivante
    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    // 🔹 Aller à l'image précédente
    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    // 🔹 Sélectionner une image spécifique via la miniature
    const handleSelectImage = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="image-gallery">
            <div className="main-image-container">
                <button className="nav-button left" onClick={handlePrev}>
                    ‹
                </button>

                <img
                    src={images[currentIndex]}
                    alt={`Slide ${currentIndex + 1}`}
                    className="main-image"
                />

                <button className="nav-button right" onClick={handleNext}>
                    ›
                </button>
            </div>

            <div className="thumbnails">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => handleSelectImage(index)}
                    >
                        <img src={img} alt={`Thumbnail ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function PostCard({ post, currentUser, permissions, setToast, toast }) {
    const { adDetails, images, location, views, shares, comments, favorites, posted_at, expiry_date } = post;

    const formatSpecialFeatures = (features) => {
        if (!features) return '';

        if (Array.isArray(features)) {
            return features.join(', ');
        }

        if (typeof features === 'object') {
            const selectedFeatures = Object.entries(features)
                .filter(([_, selected]) => selected)
                .map(([feature]) => feature);
            return selectedFeatures.join(', ');
        }

        return features;
    };

    const handleDeletePost = async  () => {
        if (!post.postID) return;

        if (currentUser && permissions.includes('MANAGE_POSTS')) {
            setToast({
                show: true,
                type: 'error',
                message: "Oups !! Vous n'avez pas les autorisations de gestions des annonces !"
            });
            return;
        }

        // 🔥 Supprimer d'abord les images de Firebase Storage
        await deletePostImagesFromStorage(post.postID);

        // 🔥 Ensuite, supprimer l'annonce de Firestore
        const result = await deletePost(post.postID, currentUser?.uid);
        if (result.success) {
            setToast({ show: true, type: 'info', message: result.message });
        } else {
            setToast({ show: true, type: 'error', message: result.message });
        }
    };

    return (
        <div className='post-card'>
            <ImageGallery images={images} />

            <div className="ad-details">
                <h2>{adDetails.title}</h2>
                <p className="price">{adDetails.price} RUB • {adDetails.priceType}</p>
                <p className="description">{adDetails.description}</p>
            </div>

            <div className="specs">
                {adDetails.category !== undefined ? <p><strong>Catégorie :</strong> {adDetails.category}</p> : null}
                {adDetails.brand !== undefined ? <p><strong>Marque :</strong> {adDetails.brand}</p> : null}
                {adDetails.productName !== undefined ? <p><strong>Nom du produit :</strong> {adDetails.productName}</p> : null}
                {adDetails.size !== undefined ? <p><strong>Taille :</strong> {adDetails.size}</p> : null}
                {adDetails.materials !== undefined ? <p><strong>Matériaux :</strong> {formatSpecialFeatures(adDetails.materials)}</p> : null}

                {adDetails.gender !== undefined ? <p><strong>Genre :</strong> {adDetails.gender}</p> : null}
                {adDetails.stoneType !== undefined ? <p><strong>Type de pierre :</strong> {adDetails.stoneType}</p> : null}

                {adDetails.volumeWeight !== undefined ? <p><strong>Volume/Poids :</strong> {adDetails.volumeWeight}</p> : null}

                {adDetails.origin !== undefined ? <p><strong>Origine :</strong> {adDetails.origin}</p> : null}

                {adDetails.make !== undefined ? <p><strong>Marque :</strong> {adDetails.make}</p> : null}
                {adDetails.model !== undefined ? <p><strong>Modèle :</strong> {adDetails.model}</p> : null}
                {adDetails.color !== undefined ? <p><strong>Couleur :</strong> {adDetails.color}</p> : null}
                {adDetails.connectivity !== undefined ? <p><strong>Connectivité :</strong> {formatSpecialFeatures(adDetails.connectivity)}</p> : null}
                {adDetails.storageCapacity !== undefined ? <p><strong>Capacité de stockage :</strong> {adDetails.storageCapacity}</p> : null}
                {adDetails.operatingSystem !== undefined ? <p><strong>Système d'exploitation :</strong> {adDetails.operatingSystem}</p> : null}
                {adDetails.condition !== undefined ? <p><strong>Condition :</strong> {adDetails.condition}</p> : null}
            </div>

            <div className="location">
                <p><strong>Localisation:</strong> {location.address}, {location.city}, {location.country}</p>
            </div>

            <div className="engagement">
                <p>👁️ {views} vues</p>
                <p>⭐ {favorites} favoris</p>
                <p>🔄 {shares} partages</p>
                <p>💬 {comments} commentaires</p>
            </div>

            <div className="dates">
                <p>🕒 Publié le: {new Date(posted_at._seconds * 1000).toLocaleDateString()}</p>
                <p>⏳ Expire le: {new Date(expiry_date).toLocaleDateString()}</p>
            </div>

            <div className="actions">
                <button className="action-button suspend">Suspendre</button>
                <button className="action-button delete" onClick={handleDeletePost}>Supprimer</button>
                <button className="action-button restaure">Restaurer</button>
            </div>

            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
};
