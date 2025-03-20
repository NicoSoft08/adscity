import React, { useState } from 'react';
import locationFields from '../../json/locationForm.json';
import './Location.scss';

export default function Location({ onNext, onBack, onChange, formData, useUserAddress, setUseUserAddress }) {
    const [errors, setErrors] = useState({});

    // Validation dynamique des champs
    const validateForm = () => {
        const newErrors = {};
        locationFields.location.forEach(field => {
            if (field.required && !formData.location?.[field.name]) {
                newErrors[field.name] = `${field.label} est requis.`;
            }
        });
        return newErrors;
    };

    // Gestion des changements de saisie
    const handleLocationChange = (e) => {
        if (!e || !e.target) return;

        const { name, value } = e.target;
        if (!name) return;

        onChange({
            ...formData,
            location: {
                ...formData.location,
                [name]: value
            }
        });
    };

    // Vérification et passage à l'étape suivante
    const handleNext = () => {
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        onNext();
    };

    return (
        <div className="location-form">
            {locationFields.location.map(({ name, label, type, placeholder, required }) => (
                <div className="input-group">
                    <label className="input-label">{label}{required && <strong className='compulsory'>*</strong>}</label>
                    <input
                        className={`input-field ${errors[name] ? 'error' : ''}`}
                        type={type}
                        name={name}
                        placeholder={placeholder}
                        value={formData.location?.[name] || ''}
                        onChange={handleLocationChange}
                        disabled={useUserAddress}
                    />
                    {errors[name] && <p className="error-message">{errors[name]}</p>}
                </div>
            ))}

            <label className="checkbox-label">
                <input type="checkbox" name='useUserAddress' checked={useUserAddress} onChange={onChange} />
                Utiliser les informations de mon compte
            </label>

            <div className="form-navigation">
                <button className="back-button" onClick={onBack}>Retour</button>
                <button className="next-button" onClick={handleNext}>Suivant</button>
            </div>
        </div>
    );
};