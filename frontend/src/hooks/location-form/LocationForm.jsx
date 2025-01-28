import React, { useState } from 'react';
import InputField from '../input-field/InputField';
import Toast from '../../customs/Toast';

export default function LocationForm({ onNext, onBack, onChange, formData, userData }) {
    const [errors, setErrors] = useState({});
    const [useUserAddress, setUseUserAddress] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: '',
    });


    const validateForm = () => {
        const newErrors = {};
        if (!formData.location?.country) newErrors.country = "Le pays est requis.";
        if (!formData.location?.city) newErrors.city = "La ville est requise.";
        if (!formData.location?.address) newErrors.address = "L'adresse est requise.";
        return newErrors;
    }

    // Handle checkbox toggle
    const handleCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        setUseUserAddress(isChecked);

        if (isChecked) {
            // Check if userData contains location info
            if (userData?.user.country && userData?.user.city && userData?.user.address) {
                onChange({
                    ...formData,
                    location: {
                        country: userData?.user.country,
                        city: userData?.user.city,
                        address: userData?.user.address
                    }
                });

                setToast({
                    type: 'info',
                    message: 'Vous pouvez passer à l\'étape suivante !',
                    show: true,
                });
            } else {
                // Display a warning if userData is incomplete
                setToast({
                    type: 'error',
                    message: 'Vos informations de localisation sont incomplètes.\nVeuillez les compléter manuellement.',
                    show: true,
                });

                setUseUserAddress(false); // Reset checkbox
            }
        } else {
            // Reset the location when unchecked
            onChange({
                ...formData,
                location: {
                    country: '',
                    city: '',
                    address: ''
                }
            });

            setToast({
                type: 'info',
                message: 'Veuillez compléter la localisation !',
                show: true,
            });
        }
    };


    // Handle input changes for location fields
    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        onChange({
            ...formData,
            location: {
                ...formData.location,
                [name]: value
            }
        });
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
                    label="Pays"
                    name="location"
                    value={formData.location?.country || ''}
                    error={errors.country}
                    onChange={handleLocationChange}
                    disabled={useUserAddress}
                />
            </div>

            <div className="d-flex-row">
                <InputField
                    label="Ville"
                    name="location"
                    value={formData.location?.city || ''}
                    error={errors.city}
                    onChange={handleLocationChange}
                    disabled={useUserAddress}
                />
            </div>

            <div className="d-flex-row">
                <InputField
                    label="Adresse"
                    name="address"
                    value={formData.location?.address || ''}
                    error={errors.address}
                    onChange={handleLocationChange}
                    disabled={useUserAddress}
                />
            </div>

            <label style={{ marginLeft: '10px', fontWeight: 'lighter', fontSize: '14px' }}>
                <input
                    type="checkbox"
                    checked={useUserAddress}
                    onChange={handleCheckboxChange}
                />
                Utiliser les informations de mon compte
            </label>

            <div className="form-navigation">
                <button className="back-button" onClick={onBack}>
                    Retour
                </button>
                <button className="next-button" onClick={handleNext}>
                    Suivant
                </button>
            </div>

            <Toast type={toast.type} message={toast.message} show={toast.show} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
};
