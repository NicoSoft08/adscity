import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { countries } from '../../data/countries';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { addNewAdmin } from '../../routes/authRoutes';
import Spinner from '../../customs/Spinner';
import Toast from '../../customs/Toast';
import Modal from '../../customs/Modal';
import '../../styles/CreateAdmin.scss';

export default function CreateAdmin() {
    const navigate = useNavigate();
    const [confirm, setConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        permissions: []
    });
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    const adminLevels = [
        { value: 'MANAGE_POSTS', label: 'Gestion des Annonces' },
        { value: 'MANAGE_USERS', label: 'Gestion des Utilisateurs' },
        { value: 'MANAGE_PAYMENTS', label: 'Gestion des Paiements' },
        { value: 'SUPER_ADMIN', label: 'Super Admin' }
    ];

    const formatSpecialFeatures = (features) => {
        if (!features) return '';

        if (Array.isArray(features)) {
            return features.join(', ');
        }

        if (typeof features === 'object') {
            const selectedFeatures = Object.entries(features)
                .filter(([_, selected]) => selected)
                .map(([feature]) => feature);
            return selectedFeatures.join(', ');
        }

        return features;
    };

    const validateInputs = () => {
        const formErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.firstName) {
            errors.firstName = "Prénoms réquis";
        }
        if (!formData.lastName) {
            errors.lastName = "Nom de Famille réquis";
        }
        if (!formData.phoneNumber) {
            errors.phoneNumber = "Numéro de téléphone réquis";
        }
        if (!formData.email) {
            errors.email = "Email réquis";
        }
        if (!emailRegex.test(formData.email)) {
            formErrors.email = 'Veuillez entrer un email valide';
        }
        if (!formData.password) {
            errors.password = "Mot de passe réquis";
        }
        if (!formData.permissions.length) {
            errors.permissions = 'Veuillez sélectionner au moins une permission.';
        }

        return formErrors;
    };


    const handleCloseConfirm = () => {
        setConfirm(false);
        setFormData({
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            password: '',
            permissions: []
        });
    };

    const handleCancel = () => {
        handleBack();
        setFormData({
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            password: '',
            permissions: []
        });
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;

        if (name === 'permissions') {
            // Gérer les autorisations (checkboxes multiples)
            setFormData((prev) => ({
                ...prev,
                permissions: checked
                    ? [...prev.permissions, value]
                    : prev.permissions.filter((perm) => perm !== value),
            }));
        } else if (name === 'phoneNumber') {
            // Nettoyer les caractères non numériques pour les numéros de téléphone
            const numericValue = value.replace(/\D/g, '');
            setFormData((prev) => ({
                ...prev,
                [name]: numericValue,
            }));
        } else {
            // Gérer les autres types de champs (y compris les checkbox simples)
            setFormData((prev) => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    };

    const handleCountryChange = (e) => {
        const countryCode = e.target.value;
        const selectedCountry = countries.find(country => country.code === countryCode);
        setSelectedCountry(selectedCountry);
    };

    const getFullPhoneNumber = () => {
        return `${selectedCountry.dialCode}${formData.phoneNumber}`;
    };


    const handleConfirm = () => {
        const formErrors = validateInputs();

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            setIsLoading(false);
            return;
        };

        setConfirm(true);
    }

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const fullPhoneNumber = getFullPhoneNumber();
        const { firstName, lastName, email, password, permissions } = formData;

        const result = await addNewAdmin(firstName, lastName, email, fullPhoneNumber, password, permissions);

        if (result.success) {
            setTimeout(() => {
                setToast({
                    show: true,
                    type: 'success',
                    message: 'Admin ajouté avec succès !'
                });
                setIsLoading(false);
                handleCloseConfirm();
                setFormData({
                    firstName: '',
                    lastName: '',
                    phoneNumber: '',
                    email: '',
                    password: '',
                    permissions: []
                });
            }, 3000);
        } else {
            setToast({
                show: true,
                type: 'error',
                message: result.message
            });
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/admin/dashboard/panel');
    }

    return (
        <div className='create-admin'>
            <div className="head">
                <FontAwesomeIcon icon={faChevronLeft} title='Go Back' onClick={handleBack} />
                <h2>Créer un administrateur</h2>
            </div>
            <div className="form">

                <div className="step-content">
                    <h3>Information Personnelle</h3>
                    <input
                        className={`input-field ${errors.firstName ? 'error' : ''}`}
                        type="text"
                        name='firstName'
                        placeholder='Prénoms'
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                    {errors.firstName && <div className="error-text">{errors.firstName}</div>}
                    <input
                        className={`input-field ${errors.lastName ? 'error' : ''}`}
                        type="text"
                        name='lastName'
                        placeholder='Nom de famille'
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                    {errors.lastName && <div className="error-text">{errors.lastName}</div>}
                </div>

                <div className="step-content">
                    <h3>Informations de Contact</h3>
                    <input
                        className={`input-field ${errors.email ? 'error' : ''}`}
                        type='email'
                        name='email'
                        placeholder='Email'
                        value={formData.email}
                        onChange={handleChange}
                    />

                    {errors.email && <div className="error-text">{errors.email}</div>}

                    <div className="phone-input-container">
                        <div className="select-wrapper">
                            <select
                                className="country-select"
                                value={selectedCountry.code}
                                onChange={handleCountryChange}
                            >
                                {countries.map((country) => (
                                    <option key={country.code} value={country.code}>
                                        {country.code} ({country.dialCode})
                                    </option>
                                ))}
                            </select>
                            <img
                                src={selectedCountry.flag}
                                alt={`${selectedCountry.name} flag`}
                                className="selected-flag"
                            />
                        </div>
                        <input
                            type='tel'
                            name='phoneNumber'
                            placeholder='Numéro de téléphone'
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className={`input-field ${errors.phoneNumber ? 'error' : ''}`}
                        />
                    </div>
                    {errors.phoneNumber && <div className="error-text">{errors.phoneNumber}</div>}
                </div>

                <div className="step-content">
                    <h3>Autorisations</h3>
                    <div className="permissions-group">
                        {adminLevels.map(permission => (
                            <div key={permission.value} className="checkbox-container">
                                <input
                                    type="checkbox"
                                    id={permission.value}
                                    name="permissions"
                                    value={permission.value}
                                    checked={formData.permissions.includes(permission.value)}
                                    onChange={handleChange}
                                />
                                <label htmlFor={permission.value}>
                                    {permission.label}
                                </label>
                            </div>
                        ))}
                    </div>
                    {errors.permissions && <div className="error-text">{errors.permissions}</div>}
                </div>

                <div className="step-content">
                    <h3>Sécurité</h3>

                    {/* Champ pour le mot de passe */}
                    <div className="password-toggle">
                        <input
                            className={`input-field ${errors.password ? 'error' : ''}`}
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            placeholder="Mot de passe"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <span onClick={toggleShowPassword} className="toggle-password-visibility">
                            {showPassword
                                ? <FontAwesomeIcon icon={faEyeSlash} title="Cacher" />
                                : <FontAwesomeIcon icon={faEye} title="Afficher" />
                            }
                        </span>
                        {errors.password && <div className="error-text">{errors.password}</div>}
                    </div>
                </div>

                <div className="navigation-buttons">
                    <button className='next' onClick={handleCancel}>Annuler</button>
                    <button onClick={handleConfirm} className='submit'>
                        {isLoading ? <Spinner /> : "Confirmer"}
                    </button>
                </div>
            </div>

            {confirm && (
                <Modal
                    title={"Confirmation"}
                    onShow={confirm}
                    onHide={handleCloseConfirm}
                    isNext={true}
                    onNext={handleAddAdmin}
                    nextText={isLoading ? <Spinner /> : "Confirmer"}
                    hideText={"Annuler"}
                >
                    <p>
                        Confirmez-vous ajouter <strong>{formData.firstName} {formData.lastName}</strong> (<i>{formData.email}</i>)
                        en tant qu'administrateur au niveau <strong>{formatSpecialFeatures(formData.permissions)}</strong> ?
                    </p>
                </Modal>
            )}

            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
};
