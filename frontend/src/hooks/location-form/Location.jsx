import React, { useState, useEffect } from 'react';
import citiesData from '../../data/ru.json';
import './Location.scss';

export default function Location({ onNext, onBack, userData, formData, setFormData }) {
    const [errors, setErrors] = useState({});
    const [useUserInfo, setUseUserInfo] = useState(false);
    const [filteredCities, setFilteredCities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (useUserInfo) {
            setFormData(prev => ({
                ...prev,
                location: {
                    ...prev.location,
                    city: userData.city,
                    address: userData.address
                }
            }));
            setSearchTerm(userData.city);
        }
    }, [useUserInfo, setFormData, userData]);

    // Initialisation du pays à "Russie"
    // useEffect(() => {
    //     if (!formData?.location?.country) {
    //         setFormData(prev => ({
    //             ...prev,
    //             location: { ...prev.location, country: 'Russie' }
    //         }));
    //     }
    // }, [formData, setFormData]);

    // Filtrer les villes en fonction de la recherche
    useEffect(() => {
        if (searchTerm.length > 0) {
            const results = citiesData.filter(city =>
                city.city.toLowerCase().startsWith(searchTerm.toLowerCase())
            );
            setFilteredCities(results);
        } else {
            setFilteredCities([]);
        }
    }, [searchTerm]);

    // Met à jour le formulaire en cas de changement des champs
    const handleAddressChange = (e) => {
        setFormData(prev => ({
            ...prev,
            location: { ...prev.location, address: e.target.value }
        }));
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.length >= 2) {
            const filtered = citiesData.filter(city =>
                city.city.toLowerCase().startsWith(value.toLowerCase())
            );
            setFilteredCities(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleCitySelect = (city) => {
        setFormData(prev => ({
            ...prev,
            city: city.city // Stocke uniquement le nom de la ville
        }));
        setSearchTerm(city.city); // Mettre à jour l'input avec la ville sélectionnée
        setShowSuggestions(false);
    };

    // Validation des champs
    const validateForm = () => {
        const newErrors = {};
        if (!formData?.location?.city) {
            newErrors.city = 'La ville est requise';
        }
        if (!formData?.location?.address) {
            newErrors.address = "L'adresse est requise";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Vérification et passage à l'étape suivante
    const handleNext = () => {
        if (!validateForm()) {
            return;
        }
        onNext();
    };

    return (
        <div className="location-form">
            {/* Pays */}
            <div className="input-group">
                <label className="input-label">Pays <strong className='compulsory'>*</strong></label>
                <input
                    className="input-field"
                    type="text"
                    name="location.country"
                    value="Russie"
                    readOnly
                />
            </div>

            <div className="search-field">
                <label className="input-label">Ville <strong className='compulsory'>*</strong></label>
                <input
                    type="text"
                    name="searchTerm"
                    placeholder="Rechercher une ville"
                    value={searchTerm}
                    className={`input-field ${errors.searchTerm ? "error" : ""}`}
                    onChange={handleSearch}
                />

                {showSuggestions && (
                    <ul className="suggestions-list">
                        {filteredCities.map((city, index) => (
                            <li key={index} onClick={() => handleCitySelect(city)}>
                                {city.city}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Adresse */}
            <div className="input-group">
                <label className="input-label">Adresse <strong className='compulsory'>*</strong></label>
                <input
                    className={`input-field ${errors.address ? 'error' : ''}`}
                    type="text"
                    name="location.address"
                    placeholder="Adresse complète"
                    value={formData?.location?.address || ''}
                    onChange={handleAddressChange}
                />
                {errors.address && <p className="error-message">{errors.address}</p>}
            </div>

            {/* Auto-remplissage des infos utilisateur */}
            <div className="input-group checkbox-group">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={useUserInfo}
                        onChange={() => setUseUserInfo(prev => !prev)}
                    />
                    Utiliser mes informations enregistrées
                </label>
            </div>


            {/* Navigation */}
            <div className="form-navigation">
                <button className="back-button" onClick={onBack}>Retour</button>
                <button className="next-button" onClick={handleNext}>Suivant</button>
            </div>
        </div>
    );
};
