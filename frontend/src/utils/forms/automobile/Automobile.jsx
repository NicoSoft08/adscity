import React, { useState } from 'react';
import { carsState, carsTransmission, typeOfFuel, typeOfPrice } from '../../../data/database';
import Spinner from '../../../customs/Spinner';
import { createAdRequest } from '../../../services/adService';
import InputField from '../../../hooks/input-field/InputField';
import '../../../styles/Automobile.scss';

export default function Automobile({
    category, subcategory, images, postType, nextStep,
    currentUser, userData, isCreateSuccess, setIsCreateSuccess
}) {
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        make: '',
        model: '',
        year: '',
        mileage: '',
        transmission: '',
        fuelType: '',
        condition: '',
        features: '',
        priceType: '',
        price: '',
        description: '',
        ad_type: postType,
        images: images,
        category: category,
        subcategory: subcategory,
        location: userData?.location || '',
        address: userData?.address || '',
        phoneNumber: userData?.phoneNumber || '',
        displayName: currentUser?.displayName || '',
        email: currentUser?.email || '',
        profilURL: currentUser?.profilURL,
    });


    const validateForm = () => {
        const newErrors = {};
        // Ici vous pouvez automatiser la validation pour chaque champ obligatoire
        ['title', 'make', 'transmission', 'fuelType', 'condition', 'features', 'priceType', 'price', 'description', 'location', 'address', 'phoneNumber', 'displayName', 'email'].forEach((field) => {
            if (!formData[field]) newErrors[field] = `${field} est requis.`;
        });
        if (formData.features.length > 1000) newErrors.features = 'Caractéristiques trop longues (max 1000 caractères).';
        if (formData.description.length > 5000) newErrors.description = 'Description trop longue (max 5000 caractères).';
        return newErrors;
    }



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            setLoading(false);
            return;
        }

        try {
            const userID = currentUser?.uid;
            const result = await createAdRequest(formData, userID);
            console.log('Annonce créée avec succès:', result);
            setIsCreateSuccess(true);
            setFormData({ ...formData, title: '', make: '', model: '', year: '', mileage: '', transmission: '', fuelType: '', condition: '', features: '', priceType: '', price: '', description: '', region: '', city: '', address: '', phoneNumber: '', displayName: '', email: '' });
        } catch (error) {
            console.error('Erreur lors de la création de l\'annonce:', error);
        }
    };


    const handleNext = () => {
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            setLoading(false);
            return;
        }

        setFormData({
            ...formData, // conserver les données précédentes
        });

        // Sauvegarder les données du formulaire dans l'état
        console.log('Données du formulaire sauvegardées temporairement:', formData);
        // Passer à l'étape suivante pour la sélection des images
        nextStep();
    }




    return (
        <div className='detail-form'>
            <form onSubmit={handleSubmit}>
                <div className="d-flex-row">
                    <InputField label="Titre de l'annonce" name="title" value={formData.title} onChange={handleChange} error={errors.title} />
                    <InputField label="Marque" name="make" value={formData.make} onChange={handleChange} error={errors.make} />
                </div>

                <div className="d-flex-row">
                    <InputField label="Modèle" name="model" value={formData.model} onChange={handleChange} error={errors.model} />
                    <InputField label="Année de fabrication" name="year" value={formData.year} onChange={handleChange} error={errors.year} type="number" />
                </div>

                <div className="d-flex-row">
                    <InputField label="Kilométrage" name="mileage" value={formData.mileage} onChange={handleChange} error={errors.mileage} type="number" />
                    <InputField label="Transmission" name="transmission" value={formData.transmission} onChange={handleChange} error={errors.transmission} options={carsTransmission.fr} />
                </div>

                <div className="d-flex-row">
                    <InputField label="Type de carburant" name="fuelType" value={formData.fuelType} onChange={handleChange} error={errors.fuelType} options={typeOfFuel.fr} />
                    <InputField label="État" name="condition" value={formData.condition} onChange={handleChange} error={errors.condition} options={carsState.fr} />
                </div>

                <div className="d-flex-row">
                    <InputField label="Caractéristiques" name="features" value={formData.features} onChange={handleChange} error={errors.features} type="textarea" />
                </div>

                <div className="d-flex-row">
                    <InputField label="Description" name="description" value={formData.description} onChange={handleChange} error={errors.description} type="textarea" />
                </div>

                <div className="d-flex-row">
                    <InputField label="Type de prix" name="priceType" value={formData.priceType} onChange={handleChange} error={errors.priceType} options={typeOfPrice.fr} />
                    <InputField label="Prix" name="price" value={formData.price} onChange={handleChange} error={errors.price} type="number" />
                </div>

                <div className="d-flex-row">
                    <InputField label="Localisation" name="location" value={formData.location} onChange={handleChange} error={errors.location} />
                </div>

                <div className="d-flex-row">
                    <InputField label="Adresse" name="address" value={formData.address} onChange={handleChange} error={errors.address} />
                    <InputField label="Téléphone" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} error={errors.phoneNumber} type="tel" />
                </div>

                <div className="d-flex-row">
                    <InputField label="Annonceur" name="displayName" value={formData.displayName} onChange={handleChange} error={errors.displayName} />
                    <InputField label="Email" name="email" value={formData.email} onChange={handleChange} error={errors.email} />
                </div>

                <button type="button" onClick={handleNext} className={!loading ? 'pointer' : 'disabled'} disabled={loading}>
                    {loading ? <Spinner /> : 'Suivant'}
                </button>
            </form>
        </div>
    );
};
