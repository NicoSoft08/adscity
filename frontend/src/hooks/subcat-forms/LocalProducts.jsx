import React, { useState } from 'react';
import { typeOfPrice, unitOfMeasureOptions } from '../../data/database';
import InputField from '../input-field/InputField';
import Toast from '../../customs/Toast';

export default function LocalProducts({ formData, onBack, onChange, onNext }) {
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: '',
    });

    const fields = [
        { label: 'Titre de l\'annonce', name: 'title', type: 'text', message: 'Le titre est requis.', required: true, placeholder: 'Ex. : Vente de poudre de manioc bio' },
        { label: 'Type de produit', name: 'productType', type: 'text', message: 'Le type de produit est requis.', required: true, placeholder: 'Ex: maïs, riz, manioc, fruits, légumes' },
        { label: 'Quantité disponible', name: 'quantityAvailable', type: 'text', message: 'La quantité disponible est requise.', required: true, placeholder: 'Ex. : 100 kg, 100 pièces' },
        { label: 'Unité de mesure', name: 'unitOfMeasure', type: 'select', options: unitOfMeasureOptions.fr, message: 'L\'unité de mesure est requise.', required: true },
        { label: 'Origine du produit', name: 'origin', type: 'text', message: 'L\'origine du produit est requise.', required: true, placeholder: 'Ex. : Abidjan, Côte d\'Ivoire' },
        { label: 'Description', name: 'description', type: 'textarea', message: 'La description est requise.', required: true, placeholder: 'Décrivez votre produit en détail (méthode de culture, fraîcheur, avantages, etc.)' },
        { label: 'Type de prix', name: 'priceType', type: 'select', options: typeOfPrice.fr, message: 'Le type de prix est requis.', required: true },
        { label: 'Prix par unité', name: 'price', type: 'number', message: 'Le prix par unité est requis.', required: true, placeholder: 'Ex. : 1500 (sans symbole)' },
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
