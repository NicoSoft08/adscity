import { faImages, faInfoCircle, faMapMarker, faTags } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { useState } from 'react';
import { formatSpecialFeatures } from '../func';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import data from '../json/data.json';
import '../styles/Tab.scss';

export default function Tab({ formData }) {
    const [activeTab, setActiveTab] = useState('category');

    const tabs = [
        { id: 'category', label: 'Catégorisation', icon: faTags },
        { id: 'details', label: 'Détails', icon: faInfoCircle },
        { id: 'photos', label: 'Photos', icon: faImages },
        { id: 'location', label: 'Emplacement', icon: faMapMarker },
    ];

    const formatCategorization = () => {
        let category = "";
        let subcategory = "";

        if (formData.category) {
            const categoryData = data.categories.find(cat => cat.categoryName === formData.category);
            if (categoryData) category = categoryData.categoryTitles.fr;
        }

        if (formData.subcategory) {
            const categoryData = data.categories.find(cat => cat.categoryName === formData.category);
            if (categoryData) {
                const subcategoryData = categoryData.container.find(subcat => subcat.sousCategoryName === formData.subcategory);
                if (subcategoryData) subcategory = subcategoryData.sousCategoryTitles.fr;
            }
        }

        return { category, subcategory };
    };

    const { category, subcategory } = formatCategorization();

    const renderContent = () => {
        switch (activeTab) {
            case 'category':
                return (
                    <div className="tab-content">
                        <p>Catégorie: {category}</p>
                        <p>Sous-catégorie: {subcategory}</p>
                    </div>
                );
            case 'details':
                return (
                    <div className="tab-content">
                        <p>Titre: {formData.details?.title}</p>
                        <p>Description: {formData.details?.description}</p>

                        {formData.details?.vehicle_type !== undefined ? (<p>Type de véhicule: {formData.details?.vehicle_type}</p>) : null}
                        {formData.details?.brand !== undefined ? (<p>Marque: {formData.details?.brand}</p>) : null}
                        {formData.details?.model !== undefined ? (<p>Modèle: {formData.details?.model}</p>) : null}
                        {formData.details?.year !== undefined ? (<p>Année: {formData.details?.year}</p>) : null}
                        {formData.details?.mileage !== undefined ? (<p>Kilométrage: {formData.details?.mileage}</p>) : null}
                        {formData.details?.fuel_type !== undefined ? (<p>Type de carburant: {formData.details?.fuel_type}</p>) : null}
                        {formData.details?.gearbox !== undefined ? (<p>Transmission: {formData.details?.gearbox}</p>) : null}
                        {formData.details?.doors !== undefined ? (<p>Nombre de portes: {formData.details?.doors}</p>) : null}
                        {formData.details?.seats !== undefined ? (<p>Nombre de sièges: {formData.details?.seats}</p>) : null}
                        {formData.details?.color !== undefined ? (<p>Couleur: {formData.details?.color}</p>) : null}
                        {formData.details?.condition !== undefined ? (<p>État: {formData.details?.condition}</p>) : null}
                        {formData.details?.car_features !== undefined ? (<p>Équipements: {formatSpecialFeatures(formData.details?.car_features)}</p>) : null}
                        {formData.details?.documents !== undefined ? (<p>Documents disponibles: {formatSpecialFeatures(formData.details?.documents)}</p>) : null}
                        {formData.details?.vehicle_type !== undefined ? (<p>Type de véhicule: {formData.details?.vehicle_type}</p>) : null}
                        {formData.details?.engine_capacity !== undefined ? (<p>Cylindrée (cc): {formData.details?.engine_capacity}</p>) : null}
                        {formData.details?.seat_count !== undefined ? (<p>Nombre de places: {formData.details?.seat_count}</p>) : null}
                        {formData.details?.rental_duration !== undefined ? (<p>Durée de location: {formData.details?.rental_duration}</p>) : null}
                        {formData.details?.rental_conditions !== undefined ? (<p>Conditions de location: {formData.details?.rental_conditions}</p>) : null}
                        {formData.details?.availability !== undefined ? (<p>Disponibilité: {formData.details?.availability}</p>) : null}
                        {formData.details?.category !== undefined ? (<p>Catégorie: {formData.details?.category}</p>) : null}
                        {formData.details?.compatibility !== undefined ? (<p>Compatibilité: {formData.details?.compatibility}</p>) : null}
                        {formData.details?.exchange !== undefined ? (<p>Échange possible: {formData.details?.exchange}</p>) : null}
                        {formData.details?.screen_size !== undefined ? (<p>Taille de l'écran (pouces): {formData.details?.screen_size}</p>) : null}
                        {formData.details?.screen_type !== undefined ? (<p>Type d'écran: {formData.details?.screen_type}</p>) : null}
                        {formData.details?.refresh_rate !== undefined ? (<p>Taux de rafraîchissement (Hz): {formData.details?.refresh_rate}</p>) : null}
                        {formData.details?.screen_protection !== undefined ? (<p>Protection écran: {formData.details?.screen_protection}</p>) : null}
                        {formData.details?.processor !== undefined ? (<p>Processeur: {formData.details?.processor}</p>) : null}
                        {formData.details?.ram !== undefined ? (<p>RAM (Go): {formData.details?.ram}</p>) : null}
                        {formData.details?.storage !== undefined ? (<p>Stockage interne (Go): {formData.details?.storage}</p>) : null}
                        {formData.details?.expandable_storage !== undefined ? (<p>Stockage extensible: {formData.details?.expandable_storage}</p>) : null}
                        {formData.details?.battery !== undefined ? (<p>Capacité de la batterie (mAh) : {formData.details?.battery}</p>) : null}
                        {formData.details?.fast_charging !== undefined ? (<p>Charge rapide (W) : {formData.details?.fast_charging}</p>) : null}
                        {formData.details?.wireless_charging !== undefined ? (<p>Charge sans fil : {formData.details?.wireless_charging}</p>) : null}
                        {formData.details?.main_camera !== undefined ? (<p>Caméra principale (MP) : {formData.details?.main_camera}</p>) : null}
                        {formData.details?.num_cameras !== undefined ? (<p>Nombre de capteurs  : {formData.details?.num_cameras}</p>) : null}
                        {formData.details?.front_camera !== undefined ? (<p>Caméra frontale (MP)  : {formData.details?.front_camera}</p>) : null}
                        {formData.details?.connectivity !== undefined ? (<p>Connectivité  : {formatSpecialFeatures(formData.details?.connectivity)}</p>) : null}
                        {formData.details?.fingerprint !== undefined ? (<p>Capteur d'empreintes  : {formData.details?.fingerprint}</p>) : null}
                        {formData.details?.face_recognition !== undefined ? (<p>Reconnaissance faciale  : {formData.details?.face_recognition}</p>) : null}
                        {formData.details?.water_resistant !== undefined ? (<p>Résistance à l’eau  : {formData.details?.water_resistant}</p>) : null}
                        {formData.details?.materials !== undefined ? (<p>Matériaux du châssis  : {formData.details?.materials}</p>) : null}
                        {formData.details?.accessories !== undefined ? (<p>Accessoires inclus  : {formatSpecialFeatures(formData.details?.accessories)}</p>) : null}
                        {formData.details?.gpu !== undefined ? (<p>Carte graphique  : {formData.details?.gpu}</p>) : null}
                        {formData.details?.operating_system !== undefined ? (<p>Système d'exploitation  : {formData.details?.operating_system}</p>) : null}
                        {formData.details?.power_supply !== undefined ? (<p>Alimentation (W)  : {formData.details?.power_supply}</p>) : null}
                        {formData.details?.ports !== undefined ? (<p>Ports disponibles  : {formatSpecialFeatures(formData.details?.ports)}</p>) : null}
                        {formData.details?.form_factor !== undefined ? (<p>Format du PC  : {formData.details?.form_factor}</p>) : null}
                        {formData.details?.cooling_system !== undefined ? (<p>Système de refroidissement  : {formData.details?.cooling_system}</p>) : null}
                        {formData.details?.keyboard_mouse !== undefined ? (<p>Clavier & Souris inclus  : {formData.details?.keyboard_mouse}</p>) : null}
                        {formData.details?.monitor !== undefined ? (<p>Écran inclus  : {formData.details?.monitor}</p>) : null}
                        {formData.details?.resolution !== undefined ? (<p>Résolution de l'écran  : {formData.details?.resolution}</p>) : null}
                        {formData.details?.battery_life !== undefined ? (<p>Autonomie de la batterie (en heures)  : {formData.details?.battery_life}</p>) : null}
                        {formData.details?.touchscreen !== undefined ? (<p>Écran tactile  : {formData.details?.touchscreen}</p>) : null}
                        {formData.details?.keyboard_backlit !== undefined ? (<p>Clavier rétroéclairé  : {formData.details?.keyboard_backlit}</p>) : null}
                        {formData.details?.weight !== undefined ? (<p>Poids (kg)  : {formData.details?.weight}</p>) : null}
                        {formData.details?.webcam !== undefined ? (<p>Webcam intégrée  : {formData.details?.webcam}</p>) : null}
                        {formData.details?.features !== undefined ? (<p>Caractéristiques spéciales  : {formatSpecialFeatures(formData.details?.features)}</p>) : null}
                        {formData.details?.power_output !== undefined ? (<p>Puissance de sortie (Watts)  : {formData.details?.power_output}</p>) : null}
                        {formData.details?.frequency_response !== undefined ? (<p>Réponse en fréquence (Hz)  : {formData.details?.frequency_response}</p>) : null}
                        {formData.details?.wireless_standard !== undefined ? (<p>Norme sans fil  : {formData.details?.wireless_standard}</p>) : null}
                        {formData.details?.storage_capacity !== undefined ? (<p>Capacité de stockage  : {formData.details?.storage_capacity}</p>) : null}
                        {formData.details?.game_title !== undefined ? (<p>Titre du jeu  : {formData.details?.game_title}</p>) : null}
                        {formData.details?.platform !== undefined ? (<p>Plateforme  : {formData.details?.platform}</p>) : null}
                        {formData.details?.edition !== undefined ? (<p>Édition du jeu  : {formData.details?.edition}</p>) : null}
                        {formData.details?.online_subscription !== undefined ? (<p>Abonnement en ligne inclus  : {formData.details?.online_subscription}</p>) : null}
                        {formData.details?.accessories_included !== undefined ? (<p>Accessoires inclus  : {formatSpecialFeatures(formData.details?.accessories_included)}</p>) : null}
                        {formData.details?.material !== undefined ? (<p>Matériau  : {formData.details?.material}</p>) : null}
                        {formData.details?.capacity !== undefined ? (<p>Capacité (mAh ou Go)  : {formData.details?.capacity}</p>) : null}
                        {formData.details?.device_type !== undefined ? (<p>Type d'appareil  : {formData.details?.device_type}</p>) : null}
                        {formData.details?.megapixels !== undefined ? (<p>Résolution (MP)  : {formData.details?.megapixels}</p>) : null}
                        {formData.details?.sensor_size !== undefined ? (<p>Taille du capteur  : {formData.details?.sensor_size}</p>) : null}
                        {formData.details?.lens_mount !== undefined ? (<p>Monture d’objectif  : {formData.details?.lens_mount}</p>) : null}
                        {formData.details?.video_resolution !== undefined ? (<p>Résolution vidéo  : {formData.details?.video_resolution}</p>) : null}
                        {formData.details?.type_vetement !== undefined ? (<p>Type de vêtement  : {formData.details?.type_vetement}</p>) : null}
                        {formData.details?.matiere !== undefined ? (<p>Matière  : {formData.details?.matiere}</p>) : null}
                        {formData.details?.saison !== undefined ? (<p>Saison  : {formData.details?.saison}</p>) : null}
                        {formData.details?.style !== undefined ? (<p>Style  : {formData.details?.style}</p>) : null}
                        {formData.details?.longueur_manches !== undefined ? (<p>Longueur des manches  : {formData.details?.longueur_manches}</p>) : null}
                        {formData.details?.size !== undefined ? (<p>Taille  : {formData.details?.size}</p>) : null}
                        {formData.details?.type_chaussure !== undefined ? (<p>Type de chaussure  : {formData.details?.type_chaussure}</p>) : null}
                        {formData.details?.pointure !== undefined ? (<p>Pointure  : {formData.details?.pointure}</p>) : null}
                        {formData.details?.hauteur_talon !== undefined ? (<p>Hauteur du talon  : {formData.details?.hauteur_talon}</p>) : null}
                        {formData.details?.type_accessoire !== undefined ? (<p>Type d'accessoire  : {formData.details?.type_accessoire}</p>) : null}
                        {formData.details?.genre !== undefined ? (<p>Genre  : {formData.details?.genre}</p>) : null}
                        {formData.details?.type_produit !== undefined ? (<p>Type de produit  : {formData.details?.type_produit}</p>) : null}
                        {formData.details?.volume !== undefined ? (<p>Volume / Contenance  : {formData.details?.volume}</p>) : null}
                        {formData.details?.composition !== undefined ? (<p>Composition  : {formData.details?.composition}</p>) : null}
                        {formData.details?.type_peau !== undefined ? (<p>Type de peau  : {formData.details?.type_peau}</p>) : null}
                        {formData.details?.origine !== undefined ? (<p>Origine  : {formData.details?.origine}</p>) : null}
                        {formData.details?.dimensions !== undefined ? (<p>Dimensions  : {formData.details?.dimensions}</p>) : null}
                        {formData.details?.longueur !== undefined ? (<p>Longueur (si applicable)  : {formData.details?.longueur}</p>) : null}
                        {formData.details?.texture !== undefined ? (<p>Texture des cheveux  : {formData.details?.texture}</p>) : null}
                        {formData.details?.fixation !== undefined ? (<p>Type de fixation  : {formData.details?.fixation}</p>) : null}
                        {formData.details?.type_sous_vetement !== undefined ? (<p>Type de sous-vêtement  : {formData.details?.type_sous_vetement}</p>) : null}
                        {formData.details?.property_type !== undefined ? (<p>Type de propriété  : {formData.details?.property_type}</p>) : null}
                        {formData.details?.transaction_type !== undefined ? (<p>Type de transaction  : {formData.details?.transaction_type}</p>) : null}
                        {formData.details?.area !== undefined ? (<p>Superficie (m²)  : {formData.details?.area}</p>) : null}
                        {formData.details?.bedrooms !== undefined ? (<p>Nombre de chambres  : {formData.details?.bedrooms}</p>) : null}
                        {formData.details?.bathrooms !== undefined ? (<p>Nombre de salles de bain  : {formData.details?.bathrooms}</p>) : null}
                        {formData.details?.furnished !== undefined ? (<p>Meublé  : {formData.details?.furnished}</p>) : null}
                        {formData.details?.parking !== undefined ? (<p>Parking  : {formData.details?.parking}</p>) : null}
                        {formData.details?.swimming_pool !== undefined ? (<p>Piscine  : {formData.details?.swimming_pool}</p>) : null}
                        {formData.details?.garden !== undefined ? (<p>Jardin  : {formData.details?.garden}</p>) : null}
                        {formData.details?.residence_type !== undefined ? (<p>Type de résidence  : {formData.details?.residence_type}</p>) : null}
                        {formData.details?.floor !== undefined ? (<p>Étage  : {formData.details?.floor}</p>) : null}
                        {formData.details?.elevator !== undefined ? (<p>Ascenseur  : {formData.details?.elevator}</p>) : null}
                        {formData.details?.security !== undefined ? (<p>Sécurité 24/7  : {formData.details?.security}</p>) : null}
                        {formData.details?.balcony !== undefined ? (<p>Balcon  : {formData.details?.balcony}</p>) : null}
                        {formData.details?.gym !== undefined ? (<p>Salle de sport  : {formData.details?.gym}</p>) : null}
                        {formData.details?.age_range !== undefined ? (<p>Tranche d'âge  : {formData.details?.age_range}</p>) : null}
                        {formData.details?.type_instrument !== undefined ? (<p>Type d'instrument  : {formData.details?.type_instrument}</p>) : null}
                        {formData.details?.event_name !== undefined ? (<p>Nom de l'événement  : {formData.details?.event_name}</p>) : null}
                        {formData.details?.event_type !== undefined ? (<p>Type d'événement  : {formData.details?.event_type}</p>) : null}
                        {formData.details?.date !== undefined ? (<p>Date de l'événement  : {formData.details?.date}</p>) : null}
                        {formData.details?.time !== undefined ? (<p>Heure de l'événement  : {formData.details?.time}</p>) : null}
                        {formData.details?.event_location !== undefined ? (<p>Lieu de l'événement  : {formData.details?.event_location}</p>) : null}

                        <p>Type de Prix: {formData.details?.price_type}</p>
                        <p>Prix: {formData.details?.price} RUB</p>
                    </div>
                );
            case 'location':
                return (
                    <div className="tab-content">
                        <p>Pays: {formData.location?.country}</p>
                        <p>Ville: {formData.location?.city}</p>
                        <p>Adresse: {formData.location?.address}</p>
                    </div>
                );
            case 'photos':
                return (
                    <div className="image-grid">
                        {formData.images?.flat().map((image, index) => (
                            <img
                                src={image}
                                alt={`photo-${index}`}
                                key={index}
                                className="review-image"
                            />
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="ad-tabs">
            <div className="tabs-header">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <FontAwesomeIcon icon={tab.icon} />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
            <div className="tab-content-container">
                {renderContent()}
            </div>
        </div>
    );
};
