import React, { useState } from 'react';
import InputField from '../input-field/InputField';
import { phoneTabletConnectivity, phoneTabletSpecialFeatures, smartphoneOS, smartphoneState, typeOfPrice } from '../../data/database';
import Toast from '../../customs/Toast';


export default function PhonesTablets({ formData, onBack, onChange, onNext }) {
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: '',
    });

    const fields = [
        { label: 'Titre de l\'annonce', name: 'title', type: 'text', placeholder: "Ex: Samsung A52 Reconditionné", message: 'Le titre est requis.', required: true },
        { label: 'Marque', name: 'make', type: 'text', placeholder: "Ex: Samsung", message: 'La marque est requise.', required: true },
        { label: 'Modèle', name: 'model', type: 'text', placeholder: "Ex: A52", message: 'Le modèle est requis.', required: true },
        { label: 'Couleur', name: 'color', type: 'text', placeholder: "Ex: Gris", message: 'La couleur est requise.', required: true },
        { label: 'Capacité de stockage', name: 'storageCapacity', type: 'text', placeholder: "Ex: 120 Go", message: 'La capacité de stockage est requise.', required: true },
        { label: 'Connectivité', name: 'connectivity', type: 'checkbox', options: phoneTabletConnectivity.fr, message: 'La connectivité est requise.', required: true },
        { label: 'Système d\'exploitation', name: 'operatingSystem', type: 'select', options: smartphoneOS.fr, message: 'Le système d\'exploitation est requis.', required: true },
        { label: 'État', name: 'condition', type: 'select', options: smartphoneState.fr, message: 'L\'état est requis.', required: true },
        { label: 'Caractéristiques spéciales', name: 'specialFeatures', type: 'checkbox', options: phoneTabletSpecialFeatures.fr, message: 'Les caractéristiques spéciales sont requises.', required: true },
        { label: 'Description', name: 'description', type: 'textarea', message: 'La description est requise.', required: true },
        { label: 'Type de prix', name: 'priceType', type: 'select', options: typeOfPrice.fr, message: 'Le type de prix est requis.', required: true },
        { label: 'Prix', name: 'price', type: 'number', message: 'Le prix est requis.', required: true, placeholder: 'Ex. : 1500 (sans symbole)' }
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
}
