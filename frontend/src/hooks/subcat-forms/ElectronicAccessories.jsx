import React, { useState } from 'react';
import { typeOfPrice } from '../../data/database';
import Toast from '../../customs/Toast';
import InputField from '../input-field/InputField';

export default function ElectronicAccessories({ formData, onBack, onChange, onNext }) {
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    
    const fields = [
        { label: "Titre de l'annonce", name: "title", type: "text", placeholder: "Ex: Casque Bluetooth Sony", message: "Le titre est requis.", required: true },
        { label: "Marque", name: "brand", type: "text", placeholder: "Ex: Apple, Samsung, Sony...", message: "La marque est requise.", required: true },
        { label: "État", name: "condition", type: "select", options: ["Neuf", "Comme neuf", "Bon état", "Usé"], message: "L'état est requis.", required: true },
        { label: "Type d'accessoire", name: "accessoryType", type: "checkbox", options: ["Casque audio", "Chargeur", "Câble USB", "Powerbank", "Coque téléphone", "Support voiture", "Clé USB", "Adaptateur HDMI"], message: "Le type d'accessoire est requis.", required: true },
        { label: "Compatibilité", name: "compatibility", type: "text", placeholder: "Ex: iPhone, Samsung, PS5, PC", message: "La compatibilité est requise.", required: true },
        { label: "Caractéristiques supplémentaires", name: "additionalFeatures", type: "checkbox", options: ["Sans fil", "Recharge rapide", "Résistant à l'eau", "Avec garantie", "Avec télécommande"], message: "Les caractéristiques supplémentaires sont requises.", required: false },
        { label: "Description", name: "description", type: "textarea", message: "La description est requise.", required: true },
        { label: "Type de prix", name: "priceType", type: "select", options: typeOfPrice.fr, message: "Le type de prix est requis.", required: true },
        { label: "Prix", name: "price", type: "number", placeholder: "Ex: 5000",  message: "Le prix est requis.", required: true }
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
