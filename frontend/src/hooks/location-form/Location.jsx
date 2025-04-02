import React, { useState, useEffect, useRef } from 'react';
import citiesData from '../../data/ru.json';
import './Location.scss';

export default function Location({ onNext, onBack, formData, setFormData }) {
    const [errors, setErrors] = useState({});
    const [filteredCities, setFilteredCities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const citySelectRef = useRef(null);

    // Initialisation du pays à "Russie"
    useEffect(() => {
        if (!formData?.location?.country) {
            setFormData(prev => ({
                ...prev,
                location: { ...prev.location, country: 'Russie' }
            }));
        }
    }, [formData, setFormData]);

    // Filtrer les villes en fonction de la recherche
    useEffect(() => {
        if (searchTerm.length > 0) {
            const results = citiesData.filter(city =>
                city.city.toLowerCase().includes(searchTerm.toLowerCase())
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

    // Sélection automatique de la ville lors du changement dans la liste
    const handleCityChange = (e) => {
        setFormData(prev => ({
            ...prev,
            location: { ...prev.location, city: e.target.value }
        }));
        // setSearchTerm(''); // Réinitialiser le champ de recherche après la sélection
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

            {/* Recherche de ville */}
            <div className="input-group">
                <label className="input-label">Rechercher une ville</label>
                <input
                    className="input-field"
                    type="text"
                    placeholder="Tapez le nom de votre ville..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Sélection de la ville */}
            {filteredCities.length > 0 && (
                <div className="input-group">
                    <label className="input-label">Ville <strong className='compulsory'>*</strong></label>
                    <select
                        ref={citySelectRef}
                        className={`input-field ${errors.city ? 'error' : ''}`}
                        name="location.city"
                        value={formData?.location?.city || ''}
                        onChange={handleCityChange}
                    >
                        <option value="">Sélectionner une ville</option>
                        {filteredCities.map((city, index) => (
                            <option key={index} value={city.city}>
                                {city.city}
                            </option>
                        ))}
                    </select>
                    {errors.city && <p className="error-message">{errors.city}</p>}
                </div>
            )}

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

            {/* Navigation */}
            <div className="form-navigation">
                <button className="back-button" onClick={onBack}>Retour</button>
                <button className="next-button" onClick={handleNext}>Suivant</button>
            </div>
        </div>
    );
};
