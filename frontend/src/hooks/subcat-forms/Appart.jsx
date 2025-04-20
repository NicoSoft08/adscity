import React, { useState } from 'react';
import InputField from '../input-field/InputField';
import { homeAppliances, roomState, typeOfPrice } from '../../data/database';
import Toast from '../../customs/Toast';

export default function Appart({ formData, onBack, onChange, onNext }) {
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
        ['title', 'propertyType', 'floor', 'appliances', 'monthlyRental', 'comfort', 'internetTv', 'view', 'surface', 'rooms', 'condition', 'priceType', 'price', 'description'].forEach((field) => {
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
                    placeholder={"Ex: Location d'Appartement 3 pièces"}
                    name="title"
                    value={formData.title}
                    onChange={onChange}
                    error={errors.title}
                />
            </div>

            <div className="d-flex-row">
                <InputField
                    label="Surface totale (m²)"
                    name="surface"
                    value={formData.surface}
                    onChange={onChange}
                    type="number"
                    error={errors.surface}
                />
            </div>

            <div className="d-flex-row">
                <InputField
                    label="Nombre de chambres"
                    name="rooms"
                    value={formData.rooms}
                    onChange={onChange}
                    type='number'
                    error={errors.rooms}
                />
            </div>

            <div className="d-flex-row">
                <InputField
                    label="Étage"
                    name="floor"
                    placeholder={"1/5"}
                    value={formData.floor}
                    onChange={onChange}
                    type="number"
                    error={errors.floor}
                />
            </div>

            <div className="d-flex-row">
                <InputField
                    label="Vue depuis la fenêtre"
                    name="view"
                    value={formData.view}
                    onChange={onChange}
                    placeholder="Ex: Cour, Rue"
                    error={errors.view}
                />
            </div>

            <div className="d-flex-row">
                <InputField
                    label="Appareils disponibles"
                    name="appliances"
                    value={formData.appliances}
                    onChange={onChange}
                    options={homeAppliances.fr}
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
                    label="Confort fourni"
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
                    label="Etat"
                    name="condition"
                    value={formData.condition}
                    onChange={onChange}
                    options={roomState.fr}
                    type="select"
                    error={errors.condition}
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

            <div className="d-flex-row">
                <InputField
                    label="Location mensuelle possible"
                    name="monthlyRental"
                    value={formData.monthlyRental}
                    onChange={onChange}
                    options={['Oui', 'Non']}
                    type='select'
                    error={errors.monthlyRental}
                />
            </div>

            <div className="d-flex-row">
                <InputField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={onChange}
                    placeholder={"Détails supplémentaires sur l'appartement"}
                    type="textarea"
                    error={errors.description}
                />
            </div>

            <div className="d-flex-row">
                <InputField
                    label="Type de Prix"
                    name="priceType"
                    value={formData.priceType}
                    onChange={onChange}
                    type="select"
                    options={typeOfPrice.fr}
                    error={errors.priceType}
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
