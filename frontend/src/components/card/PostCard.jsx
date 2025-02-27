import React, { useState } from 'react';
import Modal from '../../customs/Modal';
import Spinner from '../../customs/Spinner';
import { deletePostImagesFromStorage } from '../../routes/storageRoutes';
import { deletePost, markAsSold } from '../../routes/postRoutes';
import Toast from '../../customs/Toast';
import '../../styles/PostCard.scss';

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

export default function PostCard({ post, currentUser }) {
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [isLoading, setIsloading] = useState(false);
    const [confirm, setConfirm] = useState({ willDelete: false, willUpdate: false, willMarkAsSold: false });

    const { adDetails, images, location, views, shares, comments, favorites, posted_at, expiry_date, isSold } = post;

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

    const handleEditPost = () => {
    };

    const handleDeletePost = async (PostID) => {
        if (!PostID) return;

        setConfirm({ ...confirm, willDelete: true });
    };

    const confirmDeletePost = async () => {
        if (!post) return;
        setIsloading(true);

        try {


            // 🔥 Supprimer d'abord les images de Firebase Storage
            await deletePostImagesFromStorage(post);

            // 🔥 Ensuite, supprimer l'annonce de Firestore
            const result = await deletePost(post, currentUser?.uid);
            if (result.success) {
                setToast({ show: true, type: 'info', message: result.message });
            } else {
                setToast({ show: true, type: 'error', message: result.message });
            }
        } catch (error) {
            // console.error("Erreur lors de la suppression de l'annonce :", error);
            setToast({ show: true, type: 'error', message: "Erreur lors de la suppression." });
        } finally {
            // Réinitialise le modal
            setConfirm({ ...confirm, willDelete: false });
            setIsloading(false);
        }
    };

    const handleMarkAsSold = async (PostID) => {
        if (!PostID) return;

        try {
            const result = await markAsSold(currentUser?.uid, PostID);
            if (result.success) {
                setToast({ show: true, type: 'info', message: result.message });
            } else {
                setToast({ show: true, type: 'error', message: result.message });
            }
        } catch (error) {
            // console.error("Erreur :", error);
            setToast({ show: true, type: 'error', message: "Une erreur est survenue." });
        } finally {
            setConfirm({ ...confirm, willMarkAsSold: false });
            setIsloading(false);
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
            
            {isSold && <span className="sold-badge">VENDU</span>}

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
                <button disabled={!post.isSold} onClick={() => handleEditPost(post)} className="action-button edit">Modifier</button>
                <button onClick={() => handleDeletePost(post.PostID)} className="action-button delete">Supprimer</button>
                <button disabled={post.isSold} onClick={() => handleMarkAsSold(post.PostID)} className="action-button restaure">Marquer comme vendu</button>
            </div>

            {confirm.willDelete && (
                <Modal title={"Suppression d'annonce"} onShow={confirm.willDelete} onHide={() => setConfirm({ ...confirm, willDelete: false })}>
                    <p>Êtes-vous sûr de vouloir supprimer cette annonce ?</p>
                    <div className="ad-details-buttons">
                        <button className="modal-button approve-button" onClick={confirmDeletePost}>
                            {isLoading ? <Spinner /> : 'Confirmer'}
                        </button>
                        <button className="modal-button reject-button" onClick={() => setConfirm({ ...confirm, willDelete: false })}>
                            Annuler
                        </button>
                    </div>
                </Modal>
            )}

            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
};
