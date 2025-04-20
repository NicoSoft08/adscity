import React, { useContext, useState } from 'react';
import Toast from '../../customs/Toast';
import { useEffect } from 'react';
import FormData from '../../utils/FormData';
import '../../styles/PostCard.scss';
import { LanguageContext } from '../../contexts/LanguageContext';

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
};

const ProgressBar = ({ publishedAt, expiresAt, language }) => {
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
        return new Date(dateString).toLocaleDateString(language === 'FR' ? "fr-FR" : 'en-US', options);
    };

    return (
        <div className='progress-bar'>
            {/* Dates avec "Auj." au centre */}
            <div className='dates'>
                <span className='start'>{formatDate(publishedAt)}</span>
                <span className='today' style={{
                    left: `${todayPosition}%`,
                }}>
                    {language === 'FR' ? 'Auj.' : 'Today'}
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

export default function PostCard({ post, setToast, toast }) {
    const { details, images, location, posted_at, expiry_date, isSold } = post;
    const { language } = useContext(LanguageContext);

    return (
        <div className='post-card'>
            <ImageGallery images={images} />

            <div className="ad-details">
                <h2>{details.title}</h2>
                <p className="price">{details.price} RUB • {details.price_type}</p>
                <p className="description">{details.description}</p>
            </div>

            {isSold && <span className="sold-badge">
                {language === 'FR' ? ' VENDU' : ' SOLD'}
            </span>}

            <div className="specs">
                <FormData details={details} />
            </div>

            <div className="location">
                <p>{location.address}, {location.city}, {location.country}</p>
            </div>

            <ProgressBar publishedAt={posted_at._seconds * 1000} expiresAt={expiry_date} />
            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
};
