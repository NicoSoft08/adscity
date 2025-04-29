import React, { useContext, useEffect, useState } from 'react';
import formFields from '../../json/formFields.json';
import InputField from '../input-field/InputField';
import Toast from '../../customs/Toast';
import './Details.scss';
import { LanguageContext } from '../../contexts/LanguageContext';

export default function Details({ formData, setFormData, onChange, onNext, onBack }) {
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const { language } = useContext(LanguageContext);

    useEffect(() => {
        if (formData.subcategory) {
            const fields = formFields.fields[formData.subcategory] || [];

            setFormData(prev => {
                const currentDetails = prev.details || {};
                const updatedDetails = fields.reduce((acc, field) => {
                    acc[field.name] = currentDetails[field.name] ??
                        (field.type === "checkbox" || field.type === "file" ? [] : "");
                    return acc;
                }, {});

                return { ...prev, details: { ...currentDetails, ...updatedDetails } };
            });
        }
    }, [formData.subcategory, setFormData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (!name) return;

        setFormData((prev) => {
            const updatedFormData = { ...prev };

            if (!updatedFormData.details) {
                updatedFormData.details = {}; // ✅ Assurer que `details` existe
            }

            if (type === "checkbox") {
                updatedFormData.details[name] = checked
                    ? [...(updatedFormData.details[name] || []), value]
                    : updatedFormData.details[name].filter((v) => v !== value);
            } else {
                updatedFormData.details[name] = value;
            }

            return updatedFormData;
        });

    };

    // Vérifie si tous les champs requis sont remplis avant de permettre la navigation
    const handleNext = () => {
        const fields = formFields.fields[formData.subcategory] || [];
        const missingFields = fields
            .filter(field => field.required)
            .filter(field => {
                const value = formData.details[field.name];
                return !value || (Array.isArray(value) && value.length === 0);
            });

        if (missingFields.length > 0) {
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? `Veuillez remplir tous les champs obligatoires.`
                    : `Please fill in all required fields.`
            });

            // Auto-hide Toast après 3 secondes
            setTimeout(() => {
                setToast({ show: false, type: '', message: '' });
            }, 3000);

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
                    onChange={handleChange}
                />
            ))}

            <div className="form-navigation">
                <button type="button" className='back-button' onClick={onBack}>
                    {language === 'FR' ? "Retour" : "Back"}
                </button>
                <button type="button" className='next-button' onClick={handleNext}>
                    {language === 'FR' ? "Suivant" : "Next"}
                </button>
            </div>

            {toast.show && <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ show: false, type: '', message: '' })} />}
        </div>
    );
};
