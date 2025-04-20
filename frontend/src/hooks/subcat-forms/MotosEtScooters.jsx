import React, { useState } from 'react';
import InputField from '../input-field/InputField';
import { bikeAccessories, bikeFeatures, carsState, carsTransmission, typeOfFuel, typeOfPrice } from '../../data/database';
import Toast from '../../customs/Toast';

export default function MotosEtScooters({ formData, onBack, onChange, onNext }) {
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
        ['title', 'make', 'transmission', 'accessory', 'fuelType', 'condition', 'features', 'priceType', 'price', 'description'].forEach((field) => {
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
                    name="title"
                    value={formData.title}
                    onChange={onChange}
                    error={errors.title}
                />
            </div>

            <div className="d-flex-row">
                <InputField
                    label="Marque"
                    name="make"
                    value={formData.make}
                    onChange={onChange}
                    error={errors.make}
                />
            </div>

            <div className="d-flex-row">
                <InputField
                    label="Modèle"
                    name="model"
                    value={formData.model}
                    onChange={onChange}
                    error={errors.model}
                />
            </div>

            <div className="d-flex-row">
                <InputField
                    label="Année de fabrication"
                    name="year"
                    value={formData.year}
                    onChange={onChange}
                    type="number"
                    error={errors.year}
                />
            </div>

            <div className="d-flex-row">
                <InputField
                    label="Kilométrage"
                    name="mileage"
                    value={formData.mileage}
                    onChange={onChange}
                    type="number"
                    error={errors.mileage}
                />
            </div>

            <div className="d-flex-row">
                <InputField
                    label="Transmission"
                    name="transmission"
                    value={formData.transmission}
                    onChange={onChange}
                    options={carsTransmission.fr}
                    error={errors.transmission}
                />
            </div>

            <div className="d-flex-row">
                <InputField
                    label="Type de carburant"
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={onChange}
                    options={typeOfFuel.fr}
                    type='select'
                    error={errors.fuelType}
                />
            </div>

            <div className="d-flex-row">
                <InputField
                    label="État"
                    name="condition"
                    value={formData.condition}
                    onChange={onChange}
                    options={carsState.fr}
                    type='select'
                    error={errors.condition}
                />
            </div>

            <div className="d-flex-row">
                <InputField
                    label="Accessoires"
                    name="accessory"
                    value={formData.accessory}
                    onChange={onChange}
                    options={bikeAccessories.fr}
                    type="checkbox"
                    error={errors.accessory}
                />
            </div>

            <div className="d-flex-row">
                <InputField
                    label="Caractéristiques"
                    name="features"
                    value={formData.features}
                    onChange={onChange}
                    options={bikeFeatures.fr}
                    type="checkbox"
                    error={errors.features}
                />
            </div>

            <div className="d-flex-row">
                <InputField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={onChange}
                    type="textarea"
                    error={errors.description}
                />
            </div>

            <div className="d-flex-row">
                <InputField
                    label="Type de prix"
                    name="priceType"
                    value={formData.priceType}
                    onChange={onChange}
                    options={typeOfPrice.fr}
                    type='select'
                    error={errors.priceType}
                />
            </div>

            <div className="d-flex-row">
                <InputField
                    label="Prix CFA"
                    name="price"
                    value={formData.price}
                    onChange={onChange}
                    type="number"
                    error={errors.price}
                />
            </div>

            <div style={{ margin: '10px', display: 'flex', justifyContent: 'space-between', }}>
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
