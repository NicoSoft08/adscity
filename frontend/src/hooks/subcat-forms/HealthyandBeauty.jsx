import React, { useState } from 'react';
import InputField from '../input-field/InputField';
import Toast from '../../customs/Toast';
import { beautyAdditionalFeatures, beautyServiceOptions, typeOfPrice } from '../../data/database';

export default function  HealthyandBeauty({ formData, onBack, onChange, onNext }) {
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: '',
    });

    const fields = [
        { label: 'Titre de l\'annonce', name: 'title', type: 'text', placeholder: "Ex: Coiffure à Domicile", message: 'Le titre est requis.', required: true },
        { label: 'Type de service', name: 'serviceType', type: 'checkbox', options: beautyServiceOptions.fr, message: 'Le type de service est requis.', required: true },
        { label: 'Disponibilités', name: 'availability', type: 'text', placeholder: "Ex: Lundi au Vendredi, 9h-18h", message: 'Les disponibilités sont requises.', required: true },
        { label: 'Durée du service', name: 'serviceDuration', type: 'text', placeholder: "Ex: 1h", message: 'La durée du service est requise.', required: true },
        { label: 'Caractéristiques supplémentaires', name: 'additionalFeatures', type: 'checkbox', options: beautyAdditionalFeatures.fr, message: 'Les caractéristiques supplémentaires sont requises.', required: false },
        { label: 'Description', name: 'description', type: 'textarea', message: 'La description est requise.', required: true },
        { label: 'Type de prix', name: 'priceType', type: 'select', options: typeOfPrice.fr, message: 'Le type de prix est requis.', required: true },
        { label: 'Prix', name: 'price', type: 'number', message: 'Le prix est requis.', required: true },
    ];

    const validateForm = () => {
        const newErrors = {};
        fields.forEach(field => {
            if (field.required && !formData.adDetails[field.name]) {
                newErrors[field.name] = `${field.message}`;
            }
        });

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
            return;
        }
        onNext();
    };

    return (
        <div className='detail-form'>
            {fields.map(({ label, name, type, options, placeholder, title }) => (
                <div className="d-flex-row" key={name}>
                    <InputField
                        label={label}
                        name={name}
                        placeholder={placeholder}
                        title={title}
                        value={formData.adDetails?.[name] || ''}
                        onChange={onChange}
                        type={type}
                        options={options}
                        error={errors[name]}
                    />
                </div>
            ))}

            <div className="form-navigation">
                <button className="back-button" onClick={onBack}>
                    Retour
                </button>
                <button className="next-button" onClick={handleNext}>
                    Suivant
                </button>
            </div>

            <Toast
                type={toast.type}
                message={toast.message}
                show={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
};
