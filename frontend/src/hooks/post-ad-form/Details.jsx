import React, { useEffect } from 'react';
import formFields from '../../json/formFields.json';
import InputField from '../input-field/InputField';
import './Details.scss';

export default function Details({ formData, setFormData, onChange, onNext, onBack }) {
    useEffect(() => {
        if (formData.subcategory) {
            const fields = formFields.fields[formData.subcategory] || [];
            
            setFormData(prev => {
                const currentDetails = prev.details || {};
                const initialData = fields.reduce((acc, field) => {
                    // Si le champ existe déjà dans formData.details, ne pas le réinitialiser
                    acc[field.name] = currentDetails[field.name] ?? (field.type === "checkbox" ? [] : field.type === "file" ? [] : "");
                    return acc;
                }, {});
    
                return { ...prev, details: { ...currentDetails, ...initialData } };
            });
        }
    }, [formData.subcategory, setFormData]);

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
                <button type="button" className='next-button' onClick={onNext}>Suivant</button>
            </div>
        </div>
    );
};
