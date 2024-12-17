import React, { useState } from 'react';
import InputField from '../input-field/InputField';
import { bedroomState, includedFurniture, roomsType, typeOfPrice } from '../../data/database';
import Toast from '../../customs/Toast';

export default function Bedroom({ formData, onBack, onChange, onNext }) {
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: '',
    });

    const hideToast = () => {
        setToast({
            ...toast,
            show: false,
        });
    };

    const validateForm = () => {
        const newErrors = {};
        // Ici vous pouvez automatiser la validation pour chaque champ obligatoire
        ['title', 'furniture', 'roomType', 'propertyType', 'surface', 'condition', 'priceType', 'price', 'description'].forEach((field) => {
            if (!formData.adDetails[field]) newErrors[field] = `${field} est requis.`;
        });
        setToast({
            type: 'error',
            message: 'Veuillez remplir les champs',
            show: true,
        });
        // if (formData.adDetails?.features.length > 1000) newErrors.features = 'Caractéristiques trop longues (max 1000 caractères).';
        // if (formData.adDetails?.description.length > 5000) newErrors.description = 'Description trop longue (max 5000 caractères).';
        return newErrors;
    };

    const handleNext = () => {
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            console.log("Erreurs dans le formulaire : ", formErrors);
            return;
        }

        onNext();
    };

    return (
        <div className='detail-form'>
            <div className="d-flex-row">
                <InputField
                    label="Titre de l'annonce"
                    placeholder={"Ex: Chambre à coucher meublée à louer"}
                    name="title"
                    value={formData.title}
                    onChange={onChange}
                    error={errors.title}
                />
            </div>

            <div className="d-flex-row">
                <InputField
                    label="Type de bien"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={onChange}
                    options={['Chambre à coucher', 'Studio', 'Autre']}
                    type='select'
                    error={errors.propertyType}
                />
            </div>

            <div className="d-flex-row">
                <InputField
                    label="Surface (m²)"
                    name="surface"
                    value={formData.surface}
                    onChange={onChange}
                    type="number"
                    error={errors.surface}
                />
            </div>

            <div className="d-flex-row">
                <InputField
                    label="Nombre de lits"
                    name="beds"
                    value={formData.beds}
                    onChange={onChange}
                    type="number"
                    error={errors.beds}
                />
            </div>

            <div className="d-flex-row">
                <InputField
                    label="Confort"
                    name="comfort"
                    value={formData.comfort}
                    onChange={onChange}
                    options={['Linge de lit', 'Serviettes', 'Produits d\'hygiène']}
                    type='checkbox'
                    error={errors.comfort}
                />
            </div>

            <div className="d-flex-row">
                <InputField
                    label="Appareils disponibles"
                    name="appliances"
                    value={formData.appliances}
                    onChange={onChange}
                    options={['Climatisation', 'Réfrigérateur', 'Télévision']}
                    type='checkbox'
                    error={errors.appliances}
                />
            </div>

            <div className="d-flex-row">
                <InputField
                    label="Internet et TV"
                    name="internetTv"
                    value={formData.internetTv}
                    onChange={onChange}
                    options={['Wi-Fi', 'Télévision']}
                    type='checkbox'
                    error={errors.internetTv}
                />
            </div>

            <div className="d-flex-row">
                <InputField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={onChange}
                    placeholder={"Détails supplémentaires sur la chambre"}
                    type="textarea"
                    error={errors.description}
                />
            </div>

            <div className="d-flex-row">
                <InputField
                    label="Prix"
                    name="price"
                    value={formData.price}
                    onChange={onChange}
                    type="number"
                    error={errors.price}
                />
            </div>

            <div className="d-flex-row">
                <InputField
                    label="Caution"
                    name="deposit"
                    value={formData.deposit}
                    onChange={onChange}
                    type="number"
                    error={errors.deposit}
                />
            </div>

            <div style={{ margin: '10px', display: 'flex', justifyContent: 'space-between' }}>
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
