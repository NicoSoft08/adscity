import React, { useEffect, useState } from 'react';
import formFields from '../../json/formFields.json';
import InputField from '../input-field/InputField';
import './Details.scss';
import Toast from '../../customs/Toast';

export default function Details({ formData, setFormData, onChange, onNext, onBack }) {
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    useEffect(() => {
        if (formData.subcategory) {
            const fields = formFields.fields[formData.subcategory] || [];
            
            setFormData(prev => {
                const currentDetails = prev.details || {};
                const initialData = fields.reduce((acc, field) => {
                    acc[field.name] = currentDetails[field.name] ?? 
                        (field.type === "checkbox" ? [] : field.type === "file" ? [] : "");
                    return acc;
                }, {});

                return { ...prev, details: { ...currentDetails, ...initialData } };
            });
        }
    }, [formData.subcategory, setFormData]);

    // Vérifie si tous les champs requis sont remplis avant de permettre la navigation
    const handleNext = () => {
        const fields = formFields.fields[formData.subcategory] || [];
        const missingFields = fields
            .filter(field => field.required) // On prend uniquement les champs obligatoires
            .filter(field => {
                const value = formData.details[field.name];
                return !value || (Array.isArray(value) && value.length === 0);
            });

        if (missingFields.length > 0) {
           setToast({ show: true, type: 'error', message: `Veuillez remplir tous les champs obligatoires.` });
            return;
        }

        onNext(); // Passe à l'étape suivante uniquement si tout est rempli
    };

    return (
        <div className='details'>
            {(formFields.fields[formData.subcategory] ?? []).map(({ name, label, type, multiple, placeholder, options, required }) => (
                <InputField
                    key={name}
                    label={label}
                    name={name}
                    placeholder={placeholder}
                    type={type}
                    required={required}
                    multiple={multiple}
                    options={options}
                    value={formData.details[name]}
                    onChange={onChange}
                />
            ))}

            <div className="form-navigation">
                <button type="button" className='back-button' onClick={onBack}>Retour</button>
                <button type="button" className='next-button' onClick={handleNext}>Suivant</button>
            </div>

            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ show: false, type: '', message: '' })} />
        </div>
    );
};
