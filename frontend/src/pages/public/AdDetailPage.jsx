import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAnnonceByAdID } from '../../services/adServices';
import { fetchDataByUserID } from '../../services/userServices';
import { Swiper, SwiperSlide } from 'swiper/react';
import OwnerProfileCard from '../../components/owner-card/OwnerProfileCard';
import { FaLocationDot } from "react-icons/fa6";
import { FaEye, FaRegCalendarAlt } from "react-icons/fa";
import { formatPostedAt, formatViewCount, parseTimestamp } from '../../func';
import RelatedListing from '../../components/related-listing/RelatedListing';
import { AuthContext } from '../../contexts/AuthContext';
import 'swiper/css';
import '../../styles/AdDetailPage.scss';

export default function AdDetailPage() {
    const { adID } = useParams();
    const { currentUser } = useContext(AuthContext);
    const [ads, setAds] = useState({});
    const [profilData, setProfilData] = useState({});

    useEffect(() => {
        const fetchAdsData = async () => {
            const adData = await fetchAnnonceByAdID(adID);
            setAds(adData);
        };
        fetchAdsData();
    }, [adID]);

    const { adDetails = {}, location = {}, images = [], posted_at, views } = ads || {};
    const { title = '', price = 0, priceType = '', currency = '' } = adDetails || {};
    const { address = '', city = '', country = '' } = location || {};

    useEffect(() => {
        if (ads.userID) {
            const fetchProfilData = async () => {
                const userData = await fetchDataByUserID(ads.userID);
                setProfilData(userData);
            };
            fetchProfilData();
        }
    }, [ads.userID]);

    const postedAtDate = parseTimestamp(posted_at);

    const formatSpecialFeatures = (features) => {
        if (!features) return '';

        // If features is an array, join with commas
        if (Array.isArray(features)) {
            return features.join(', ');
        }

        // If features is an object, get selected values
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
            <div className="image-gallery">
                <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    loop={true}
                >
                    {images && images.map((image, index) => (
                        <SwiperSlide key={index}>
                            <img src={image} alt={`Ad ${index + 1}`} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

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
                    <p>{price} {currency}</p>
                </div>
            </div>

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

                            {adDetails.origin !== undefined ? <li><strong>Origine :</strong> {adDetails.origin}</li> : null}

                            {adDetails.make !== undefined ? <li><strong>Marque :</strong> {adDetails.make}</li> : null}
                            {adDetails.model !== undefined ? <li><strong>Modèle :</strong> {adDetails.model}</li> : null}
                            {adDetails.color !== undefined ? <li><strong>Couleur :</strong> {adDetails.color}</li> : null}
                            {adDetails.connectivity !== undefined ? <li><strong>Connectivité :</strong> {formatSpecialFeatures(adDetails.connectivity)}</li> : null}
                            {adDetails.storageCapacity !== undefined ? <li><strong>Capacité de stockage :</strong> {adDetails.storageCapacity}</li> : null}
                            {adDetails.operatingSystem !== undefined ? <li><strong>Système d'exploitation :</strong> {adDetails.operatingSystem}</li> : null}
                            {adDetails.condition !== undefined ? <li><strong>Condition :</strong> {adDetails.condition}</li> : null}
                        </ul>
                    </section>

                    <section className="description">
                        <h2>Description</h2>
                        <p>{adDetails.description}</p>
                    </section>

                    <section className="features">
                        <h2>Caractéristiques supplémentaires</h2>
                        <p>{formatSpecialFeatures(adDetails.specialFeatures)}</p>
                    </section>

                    <section className="location">
                        <h2>Localisation</h2>
                        <p>{address}, {city}, {country}</p>
                    </section>

                    <section className="meta-info">
                        <h2>Informations supplémentaires</h2>
                        <ul>
                            <li><strong>Catégorie :</strong> {ads.category}</li>
                            <li><strong>Sous-catégorie :</strong> {ads.subcategory}</li>
                            <li><strong>Vues :</strong> {ads.views}</li>
                        </ul>
                    </section>
                </div>
                <div className='owner'>
                    <OwnerProfileCard
                        owner={profilData}
                        userID={currentUser?.uid}
                    />
                </div>
            </div>

            <RelatedListing adID={adID} currentCategory={ads?.category} />
        </div>
    );
}
