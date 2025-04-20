import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPostById } from '../../routes/postRoutes';
import { fetchDataByUserID } from '../../routes/userRoutes';
import OwnerProfileCard from '../../components/owner-card/OwnerProfileCard';
import { FaLocationDot } from "react-icons/fa6";
import { FaEye, FaRegCalendarAlt } from "react-icons/fa";
import { formatPostedAt, formatViewCount, parseTimestamp } from '../../func';
import RelatedListing from '../../components/related-listing/RelatedListing';
import { AuthContext } from '../../contexts/AuthContext';
import Toast from '../../customs/Toast';

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

export default function PostIDPage() {
    const { postID } = useParams();
    const { currentUser } = useContext(AuthContext);
    const [post, setPost] = useState(null);
    const [profilData, setProfilData] = useState({});
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    
    useEffect(() => {
        const fetchAdsData = async () => {
            const result = await fetchPostById(postID);
            if (result.success) {
                setPost(result?.data);
            }
        };
        fetchAdsData();

    }, [postID]);

    const { adDetails = {}, location = {}, images = [], posted_at, views, category, subcategory, isSold } = post || {};
    const { title = '', price = 0, priceType = '' } = adDetails || {};
    const { address = '', city = '', country = '' } = location || {};

    useEffect(() => {
        if (post && post?.userID) {
            const fetchProfilData = async () => {
                const response = await fetchDataByUserID(post?.userID);
                setProfilData(response?.data);
            };
            fetchProfilData();
        }
    }, [post]);


    const postedAtDate = parseTimestamp(posted_at);

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
        <div className="ad-details">
            <ImageGallery images={images} />
            <div className="display">

                <div className='under_score'>
                    <div className='title'>
                        <span>{title}</span>
                        <p>
                            <FaLocationDot className='icon' /> {city}, {country}
                            <FaRegCalendarAlt className='icon' /> {formatPostedAt(postedAtDate)}
                            <FaEye className='icon' /> {formatViewCount(views)}
                        </p>
                    </div>
                    <div className='seperator' />
                    <div className='price'>
                        <span>{priceType}</span>
                        <p>{price} RUB</p>
                    </div>
                </div>

                {isSold && <span className="sold-badge">VENDU</span>}

                <div className="content">
                    <div className='detail-section'>
                        <section className="details">
                            <h2>Caractéristiques</h2>
                            <ul>
                                {adDetails.category !== undefined ? <li><strong>Catégorie :</strong> {adDetails.category}</li> : null}
                                {adDetails.brand !== undefined ? <li><strong>Marque :</strong> {adDetails.brand}</li> : null}
                                {adDetails.productName !== undefined ? <li><strong>Nom du produit :</strong> {adDetails.productName}</li> : null}
                                {adDetails.size !== undefined ? <li><strong>Taille :</strong> {adDetails.size}</li> : null}
                                {adDetails.materials !== undefined ? <li><strong>Matériaux :</strong> {formatSpecialFeatures(adDetails.materials)}</li> : null}

                                {adDetails.gender !== undefined ? <li><strong>Genre :</strong> {adDetails.gender}</li> : null}
                                {adDetails.stoneType !== undefined ? <li><strong>Type de pierre :</strong> {adDetails.stoneType}</li> : null}

                                {adDetails.volumeWeight !== undefined ? <li><strong>Volume/Poids :</strong> {adDetails.volumeWeight}</li> : null}

                                {adDetails.origin !== undefined ? <li><strong>Origine de produit :</strong> {adDetails.origin}</li> : null}

                                {adDetails.serviceType !== undefined ? <li><strong>Type de service :</strong> {adDetails.serviceType}</li> : null}
                                {adDetails.serviceDuration !== undefined ? <li><strong>Durée du service :</strong> {adDetails.serviceDuration}</li> : null}

                                {adDetails.make !== undefined ? <li><strong>Marque :</strong> {adDetails.make}</li> : null}
                                {adDetails.model !== undefined ? <li><strong>Modèle :</strong> {adDetails.model}</li> : null}
                                {adDetails.color !== undefined ? <li><strong>Couleur :</strong> {adDetails.color}</li> : null}
                                {adDetails.connectivity !== undefined ? <li><strong>Connectivité :</strong> {formatSpecialFeatures(adDetails.connectivity)}</li> : null}
                                {adDetails.storageCapacity !== undefined ? <li><strong>Capacité de stockage :</strong> {adDetails.storageCapacity}</li> : null}
                                {adDetails.operatingSystem !== undefined ? <li><strong>Système d'exploitation :</strong> {adDetails.operatingSystem}</li> : null}
                                {adDetails.condition !== undefined ? <li><strong>Condition :</strong> {adDetails.condition}</li> : null}

                                {adDetails.productType !== undefined ? <li><strong>Type de produit :</strong> {adDetails.productType}</li> : null}
                                {adDetails.quantityAvailable !== undefined ? <li><strong>Quantité disponible :</strong> {adDetails.quantityAvailable}</li> : null}
                                {adDetails.unitOfMeasure !== undefined ? <li><strong>Unité de mesure :</strong> {adDetails.unitOfMeasure}</li> : null}

                                {adDetails.accessoryType !== undefined ? <p>Type d'accessoire : {adDetails.accessoryType}</p> : null}
                                {adDetails.compatibility !== undefined ? <p>Compatibilité : {adDetails.compatibility}</p> : null}

                            </ul>
                        </section>

                        <section className="description">
                            <h2>Description</h2>
                            <p>{adDetails.description}</p>
                        </section>

                        <section className="features">
                            {adDetails.specialFeatures !== undefined ? (
                                <>
                                    <h2>Caractéristiques supplémentaires</h2>
                                    <p>{formatSpecialFeatures(adDetails.specialFeatures)}</p>
                                </>
                            ) : null}

                            {adDetails.additionalFeatures !== undefined ? (
                                <>
                                    <h2>Caractéristiques supplémentaires</h2>
                                    <p>{formatSpecialFeatures(adDetails.additionalFeatures)}</p>
                                </>
                            ) : null}
                        </section>

                        <section className="location">
                            <h2>Localisation</h2>
                            <p>{address}, {city}, {country}</p>
                        </section>

                        <section className="meta-info">
                            <h2>Informations supplémentaires</h2>
                            <ul>
                                <li><strong>Catégorie :</strong> {category}</li>
                                <li><strong>Sous-catégorie :</strong> {subcategory}</li>
                                <li><strong>Vues :</strong> {views}</li>
                            </ul>
                        </section>
                    </div>

                    {/* <MessageToAnnouncer currentUser={currentUser} announcerID={post?.userID} onSendMessage={handleSendMessage} /> */}

                    <div className='owner'>
                        <OwnerProfileCard
                            owner={profilData}
                            userID={currentUser?.uid}
                        />
                    </div>
                </div>
            </div>
            <div className="pubs"></div>


            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />

            <RelatedListing postID={postID} category={category} />
        </div>
    );
};
