import React, { useState } from 'react';
import InputField from '../input-field/InputField';
import { carsBodyType, carsFeatures, carsSafetyOptions, carsState, carsTransmission, currency, typeOfFuel, typeOfPrice } from '../../data/database';
import Toast from '../../customs/Toast';

export default function Voitures({ formData, onBack, onChange, onNext }) {
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: '',
    });

    const fields = [
        { label: 'Titre de l\'annonce', name: 'title', type: 'text' },
        { label: 'Marque', name: 'make', type: 'text' },
        { label: 'Modèle', name: 'model', type: 'text' },
        { label: 'Année de fabrication', name: 'year', type: 'number' },
        { label: 'Kilométrage', name: 'mileage', type: 'number' },
        { label: 'Carrosserie', name: 'bodyType', type: 'select', options: carsBodyType.fr },
        { label: 'Transmission', name: 'transmission', type: 'select', options: carsTransmission.fr },
        { label: 'Type de carburant', name: 'fuelType', type: 'select', options: typeOfFuel.fr },
        { label: 'Options de Sécurité', name: 'safetyOptions', type: 'checkbox', options: carsSafetyOptions.fr },
        { label: 'Caractéristiques', name: 'features', type: 'checkbox', options: carsFeatures.fr },
        { label: 'État', name: 'condition', type: 'select', options: carsState.fr },
        { label: 'Description', name: 'description', type: 'textarea' },
        { label: 'Type de prix', name: 'priceType', type: 'select', options: typeOfPrice.fr },
        { label: 'Devise', name: 'currency', type: 'select', options: currency.fr },
        { label: 'Prix CFA', name: 'price', type: 'number' }
    ];

    const hideToast = () => {
        setToast({
            ...toast,
            show: false,
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (formData?.adDetails) {
            // Champs requis
            const requiredFields = [
                { name: 'title', message: 'Le titre est requis.' },
                { name: 'make', message: 'La marque est requise.' },
                { name: 'model', message: 'Le modèle est requis.' },
                { name: 'year', message: 'L\'année de fabrication est requise.' },
                { name: 'mileage', message: 'Le kilométrage est requis.' },
                { name: 'transmission', message: 'La transmission est requise.' },
                { name: 'bodyType', message: 'La carrosserie est requise.' },
                { name: 'safetyOptions', message: 'Les options de sécurité sont requises.' },
                { name: 'fuelType', message: 'Le type de carburant est requis.' },
                { name: 'condition', message: 'L\'état est requis.' },
                { name: 'features', message: 'Les caractéristiques sont requises.' },
                { name: 'priceType', message: 'Le type de prix est requis.' },
                { name: 'currency', message: 'La devise est requise.' },
                { name: 'price', message: 'Le prix est requis.' },
                { name: 'description', message: 'La description est requise.' },
            ];

            // Vérification des champs requis
            requiredFields.forEach((field) => {
                if (!formData.adDetails[field]) {
                    newErrors[field] = `${field} est requis.`;
                }
            });

            // Vérification des longueurs
            if (formData.adDetails.features?.length > 1000) {
                newErrors.features = 'Les caractéristiques ne doivent pas dépasser 1000 caractères.';
            }
            if (formData.adDetails.description?.length > 5000) {
                newErrors.description = 'La description ne doit pas dépasser 5000 caractères.';
            }
        }

        // Affichage du toast si des erreurs existent
        if (Object.keys(newErrors).length > 0) {
            setToast({
                type: 'error',
                message: 'Veuillez remplir les champs correctement.',
                show: true,
            });
        }
        return newErrors;
    };


    const handleNext = () => {
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            console.log(formErrors);
            return;
        }

        // Aucune erreur détectée, passez à l'étape suivante
        onNext();
    };

    return (
        <div className='detail-form'>

            {fields.map(({ label, name, type, options }) => (
                <div className="d-flex-row" key={name}>
                    <InputField
                        label={label}
                        name={name}
                        value={formData[name] || ''}
                        onChange={onChange}
                        type={type}
                        options={options}
                        error={errors[name]}
                    />
                </div>
            ))}

            <div style={{ margin: '10px', display: 'flex', justifyContent: 'space-between', }}>
                <button
                    style={{ backgroundColor: '#dc3545', cursor: 'pointer', borderRadius: '5px', border: 'none', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}
                    onClick={onBack}
                >
                    Retour
                </button>
                <button
                    style={{ backgroundColor: '#417abc', cursor: 'pointer', borderRadius: '5px', border: 'none', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}
                    onClick={handleNext}
                >
                    Suivant
                </button>
            </div>

            <Toast
                type={toast.type}
                message={toast.message}
                show={toast.show}
                onClose={hideToast}
            />
        </div>
    );
};
