import React, { useState } from 'react';
import InputField from '../input-field/InputField';
import { carsState, clotheSize, clotheStuff, currency, typeOfPrice, womenClotheCategory } from '../../data/database';
import Toast from '../../customs/Toast';

export default function WomenClothing({ formData, onBack, onChange, onNext }) {
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: '',
    });

    const fields = [
        { label: 'Titre de l\'annonce', name: 'title', type: 'text', message: 'Le titre est requis.', required: true },
        { label: 'Catégorie', name: 'category', type: 'select', options: womenClotheCategory.fr, message: 'La catégorie est requise.', required: true },
        { label: 'Marque', name: 'brand', type: 'text', message: 'La marque est requise.', required: true },
        { label: 'Nom du produit', name: 'productName', type: 'text', message: 'Le nom du produit est requis.', required: true },
        { label: 'Taille', name: 'size', type: 'select', options: clotheSize.fr, message: 'La taille est requise.', required: true },
        { label: 'Couleur', name: 'color', type: 'text', message: 'La couleur est requise.', required: true },
        { label: 'État', name: 'condition', type: 'select', options: carsState.fr, message: 'La condition est requise.', required: true },
        { label: 'Matériaux', name: 'materials', type: 'checkbox', options: clotheStuff.fr, message: 'Les matériaux sont requis.', required: true },
        { label: 'Description', name: 'description', type: 'textarea', message: 'La description est requise.', required: true },
        { label: 'Type de prix', name: 'priceType', type: 'select', options: typeOfPrice.fr, message: 'Le type de prix est requis.', required: true },
        { label: 'Devise', name: 'currency', type: 'select', options: currency.fr, message: 'La devise est requise.', required: true, title: 'La devise correspondant à votre zone géographique' },
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
