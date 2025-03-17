import React, { useEffect, useState } from 'react';
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

const ProgressBar = ({ publishedAt, expiresAt }) => {
    const [progress, setProgress] = useState(0);
    const [todayPosition, setTodayPosition] = useState(0);

    useEffect(() => {
        const startDate = new Date(publishedAt).getTime();
        const endDate = new Date(expiresAt).getTime();
        const now = Date.now();

        if (now < startDate) {
            setProgress(0);
            setTodayPosition(0);
        } else if (now > endDate) {
            setProgress(100);
            setTodayPosition(100);
        } else {
            const totalDuration = endDate - startDate;
            const elapsedTime = now - startDate;
            const progressPercentage = (elapsedTime / totalDuration) * 100;
            setProgress(progressPercentage);
            setTodayPosition(progressPercentage);
        }
    }, [publishedAt, expiresAt]);

    // Fonction pour formater la date en "14 mars"
    const formatDate = (dateString) => {
        const options = { day: "numeric", month: "short" };
        return new Date(dateString).toLocaleDateString("fr-FR", options);
    };

    return (
        <div className='progress-bar'>
            {/* Dates avec "Auj." au centre */}
            <div className='dates'>
                <span className='start'>{formatDate(publishedAt)}</span>
                <span className='today' style={{
                    left: `${todayPosition}%`,
                }}>
                    Auj.
                </span>
                <span className='end'>{formatDate(expiresAt)}</span>
            </div>

            {/* Barre de progression */}
            <div className='bar-line'>
                {/* Remplissage */}
                <div className='bar-fill'
                    style={{
                        width: `${progress}%`,
                    }}
                ></div>

                {/* Marqueur pour aujourd'hui */}
                <div
                    className='today-marker'
                    style={{
                        left: `${todayPosition}%`,
                    }}
                ></div>
            </div>
        </div>
    );
};


export default function PostCard({ post }) {

    const { adDetails, images, location, shares, comments, favorites, posted_at, expiry_date, isSold, stats } = post;

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
            <ProgressBar publishedAt={posted_at._seconds * 1000} expiresAt={expiry_date} />
        </div>
    );
};
