import React, { useState } from 'react';
import InputField from '../input-field/InputField';
import { carsState, jewelryCategories, jewelsGender, jewelsMaterials, stoneTypes, typeOfPrice } from '../../data/database';
import Toast from '../../customs/Toast';

export default function WatcheAndJewelry({ formData, onBack, onChange, onNext }) {
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const fields = [
        { label: 'Titre de l\'annonce', name: 'title', type: 'text', message: 'Le titre est requis.', required: true },
        { label: 'Marque', name: 'make', type: 'text', message: 'La marque est requise.', required: true },
        { label: 'Catégorie', name: 'category', type: 'select', options: jewelryCategories.fr, message: 'La catégorie est requise.', required: true },
        { label: 'Nom du produit', name: 'productName', type: 'text', message: 'Le nom du produit est requis.', required: true },
        { label: 'Genre', name: 'gender', type: 'select', options: jewelsGender.fr, message: 'Le genre est requis.', required: true },
        { label: 'Type de pierre', name: 'stoneType', type: 'select', options: stoneTypes.fr, message: 'Le type de pierre est requis.', required: true },
        { label: 'État', name: 'condition', type: 'select', options: carsState.fr, message: 'L\'état est requis.', required: true },
        { label: 'Matériaux', name: 'materials', type: 'checkbox', options: jewelsMaterials.fr, message: 'Les matériaux sont requis.', required: true },
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
