import { faImages, faInfoCircle, faMapMarker, faTags } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import data from '../json/data.json';
import FormData from '../utils/FormData';
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

                        <FormData details={formData.details} />

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
