import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { countries } from '../../data/countries';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PhoneInput from "react-phone-input-2";
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { addNewAdmin } from '../../routes/authRoutes';
import Spinner from '../../customs/Spinner';
import Toast from '../../customs/Toast';
import Modal from '../../customs/Modal';
import cities from '../../data/ru.json';
import { LanguageContext } from '../../contexts/LanguageContext';
import zxcvbn from 'zxcvbn';
import { Eye, EyeOff, Search } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import { AuthContext } from '../../contexts/AuthContext';
import "react-phone-input-2/lib/style.css";
import '../../styles/CreateAdmin.scss';

const steps = (language) => (language === 'FR'
    ? ['Informations', 'Contact', 'Location', 'Permissions', 'Sécurité']
    : ['Information', 'Contact', 'Location', 'Permissions', 'Security']);

const strengthColors = ['red', 'orange', 'yellow', 'green'];

export default function CreateAdmin() {
    const navigate = useNavigate();
    const { language } = useContext(LanguageContext);
    const { currentUser } = useContext(AuthContext);
    const [confirm, setConfirm] = useState(false);
    const [step, setStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedCountry] = useState(countries[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCities, setFilteredCities] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [captchaValue, setCaptchaValue] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        country: selectedCountry.name,
        city: '',
        address: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        permissions: []
    });
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    // Replace with your actual reCAPTCHA site key
    const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

    const adminLevels = [
        {
            value: 'MANAGE_POSTS',
            label: language === 'FR'
                ? 'Gestion des Annonces'
                : 'Manage Ads'
        },
        {
            value: 'MANAGE_USERS',
            label: language === 'FR'
                ? 'Gestion des Utilisateurs'
                : 'Manage Users'
        },
        {
            value: 'MANAGE_PAYMENTS',
            label: language === 'FR'
                ? 'Gestion des Paiements'
                : 'Manage Payments',
        },
        {
            value: 'SUPER_ADMIN',
            label: 'Super Admin'
        }
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

    // Use a consistent approach for phone numbers
    const handlePhoneChange = (value) => {
        setFormData(prev => ({
            ...prev,
            phoneNumber: value
        }));
    };

    const validate = (currentStep) => {
        const newErrors = {};
        const { firstName, lastName, email, phoneNumber, password, city, address, permissions } = formData;

        if (currentStep === 0) {
            if (!firstName.trim()) newErrors.firstName = language === 'FR'
                ? "Prénoms réquis"
                : "First Name is required";
            if (!lastName.trim()) newErrors.lastName = language === 'FR'
                ? "Nom de Famille réquis"
                : "Last Name is required";
        }
        if (currentStep === 1) {
            if (!email.trim()) newErrors.email = language === 'FR'
                ? "Email réquis"
                : "Email is required";
            else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = language === 'FR'
                ? 'Veuillez entrer un email valide'
                : 'Please enter a valid email';
            if (!phoneNumber.trim()) newErrors.phoneNumber = language === 'FR'
                ? "Numéro de téléphone réquis"
                : "Phone Number is required";
            else if (!phoneNumber.trim() || phoneNumber.length < 10) newErrors.phoneNumber = language === 'FR'
                ? "Numéro de téléphone invalide"
                : "Invalid Phone Number";
        }
        if (currentStep === 2) {
            if (!searchTerm.trim()) newErrors.city = language === 'FR'
                ? 'Ville requise'
                : "City is required";
            if (!city.trim()) newErrors.city = language === 'FR'
                ? 'Ville requise'
                : "City is required";
            if (!address.trim()) newErrors.address = language === 'FR'
                ? 'Adresse requise'
                : "Address is required";
        }
        if (currentStep === 3) {
            if (!permissions.length) newErrors.permissions = language === 'FR'
                ? 'Sélectionnez au moins un niveau de permission'
                : "Select at least one permission level";
        }
        // For password validation
        if (currentStep === 4) {
            if (!password.trim()) {
                newErrors.password = language === 'FR'
                    ? 'Mot de passe requis'
                    : "Password is required";
            } else if (password.length < 6) {
                newErrors.password = language === 'FR'
                    ? 'Mot de passe trop court (minimum 6 caractères)'
                    : "Password must be at least 6 characters";
            } else if (passwordStrength < 2) {
                newErrors.password = language === 'FR'
                    ? 'Mot de passe trop faible'
                    : "Password is too weak";
            }
        }

        // Only check CAPTCHA on final step
        if (currentStep === 4 && !captchaValue) {
            newErrors.captcha = language === 'FR'
                ? "Veuillez confirmer que vous n'êtes pas un robot"
                : "Please confirm that you are not a robot";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.length >= 2) {
            const filtered = cities.filter(city =>
                city.city.toLowerCase().startsWith(value.toLowerCase())
            );
            setFilteredCities(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const passwordStrength = zxcvbn(formData.password).score;

    const nextStep = () => {
        if (validate(step)) setStep(prev => prev + 1);
    };
    const prevStep = () => setStep(step - 1);


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

    const handleCaptchaChange = (value) => {
        setCaptchaValue(value);
        // Clear captcha error if it exists
        if (errors.captcha) {
            setErrors({
                ...errors,
                captcha: ''
            });
        }
    };

    const handleCitySelect = (city) => {
        setFormData(prev => ({
            ...prev,
            city: city.city // Stocke uniquement le nom de la ville
        }));
        setSearchTerm(city.city); // Mettre à jour l'input avec la ville sélectionnée
        setShowSuggestions(false);
    };

    const handleAddAdmin = () => {
        setFormData(prev => ({
            ...prev,
            permissions: [...prev.permissions, 'admin']
        }));
    };

    // Standardize the parameters for addNewAdmin
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate(step)) {
            return;
        }

        setIsLoading(true);

        try {
            const {
                firstName, lastName, email, password,
                permissions, address, city, country
            } = formData;

            const phoneNumber = formData.phoneNumber.startsWith('+')
                ? formData.phoneNumber
                : `+${formData.phoneNumber}`;

            const displayName = `${firstName} ${lastName}`;

            const idToken = await currentUser.getIdToken();
            const result = await addNewAdmin(
                displayName,
                firstName,
                lastName,
                email,
                phoneNumber,
                password,
                permissions,
                address,
                city,
                country,
                captchaValue,
                idToken
            );

            if (result.success) {
                setToast({
                    show: true,
                    type: 'success',
                    message: language === 'FR'
                        ? 'Admin ajouté avec succès !'
                        : 'Admin added successfully!'
                });

                setTimeout(() => {
                    navigate('/admin/dashboard/panel');
                }, 3000);
            } else {
                setToast({
                    show: true,
                    type: 'error',
                    message: result.message || (language === 'FR'
                        ? 'Erreur lors de la création de l\'admin'
                        : 'Error creating admin')
                });

                // Reset captcha
                if (window.grecaptcha) {
                    window.grecaptcha.reset();
                }
                setCaptchaValue(null);
            }
        } catch (error) {
            console.error('Error creating admin:', error);
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? 'Une erreur est survenue lors de la création de l\'admin'
                    : 'An error occurred while creating the admin'
            });
        } finally {
            setIsLoading(false);
        }
    };


    const handleBack = () => {
        navigate('/admin/dashboard/panel');
    }

    return (
        <div className='create-admin'>
            <div className="head">
                <div className="back">
                    <FontAwesomeIcon icon={faChevronLeft} title='Go Back' onClick={handleBack} />
                </div>
                <div className="title">
                    <h2>{language === 'FR'
                        ? "Créer un admin"
                        : "Create admin"
                    }
                    </h2>
                </div>
            </div>

            <div className="signup-form">
                {/* Progress Bar */}
                <div className="progress-bar">
                    {steps(language).map((label, index) => (
                        <div key={index} className="step">
                            <div className={`bulb ${index <= step ? 'active' : ''}`}>{index + 1}</div>
                            <div className={`label ${index <= step ? 'active' : ''}`}>{label}</div>
                        </div>
                    ))}
                </div>

                {/* Form Steps */}
                <div className="form-group">
                    {step === 0 && (
                        <div className='form-group-item'>
                            <input
                                type='text'
                                name='firstName'
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder={language === 'FR' ? 'Prénom' : 'First Name'}
                                className={`input-field ${errors.firstName ? 'error' : ''}`}
                            />
                            {errors.firstName && <span className='error-message'>{errors.firstName}</span>}

                            <input
                                type='text'
                                name='lastName'
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder={language === 'FR' ? 'Nom de Famille' : 'Last Name'}
                                className={`input-field ${errors.lastName ? 'error' : ''}`}
                            />
                            {errors.lastName && <span className='error-message'>{errors.lastName}</span>}
                        </div>
                    )}

                    {step === 1 && (
                        <div className='form-group-item'>
                            <input
                                type='email'
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                placeholder={language === 'FR' ? 'Email' : 'Email'}
                                className={`input-field ${errors.email ? 'error' : ''}`}
                            />
                            {errors.email && <span className='error-message'>{errors.email}</span>}

                            <PhoneInput
                                country={"ru"} // Pays par défaut (Russie ici)
                                onlyCountries={['ru']}
                                value={formData.phoneNumber}
                                onChange={handlePhoneChange}
                                inputStyle={{ width: "100%" }}
                            />
                            {errors.phoneNumber && <span className='error-message'>{errors.phoneNumber}</span>}
                        </div>
                    )}

                    {step === 2 && (
                        <div className='form-group-item'>
                            <input
                                type='text'
                                name='country'
                                value={formData.country}
                                onChange={handleChange}
                                placeholder={language === 'FR' ? 'Pays' : 'Country'}
                                className={`input-field ${errors.country ? 'error' : ''}`}
                            />
                            {errors.country && <span className='error-message'>{errors.country}</span>}

                            <div className="search-field">
                                <input
                                    type="text"
                                    name="searchTerm"
                                    placeholder={language === 'FR' ? 'Rechercher une ville' : 'Search a city'}
                                    value={searchTerm}
                                    className={`input-field ${errors.searchTerm ? "error" : ""}`}
                                    onChange={handleSearch}
                                />
                                <span className="search-icon">
                                    <Search size={20} />
                                </span>

                                {showSuggestions && (
                                    <ul className="suggestions-list">
                                        {filteredCities.map((city, index) => (
                                            <li key={index} onClick={() => handleCitySelect(city)}>
                                                {city.city}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {errors.city && <span className='error-message'>{errors.city}</span>}

                            <input
                                type='text'
                                name='address'
                                value={formData.address}
                                onChange={handleChange}
                                placeholder={language === 'FR' ? 'Adresse' : 'Address'}
                                className={`input-field ${errors.address ? 'error' : ''}`}
                            />
                            {errors.address && <span className='error-message'>{errors.address}</span>}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="form-group-item">
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
                            {errors.permissions && <div className="error-text">{errors.permissions}</div>}
                        </div>
                    )}

                    {step === 4 && (
                        <div className='form-group-item'>
                            <div className="password-field">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder={language === 'FR' ? 'Mot de passe' : 'Password'}
                                    className={`input-field ${errors.password ? 'error' : ''}`}
                                />
                                <span className='eye-icon' onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </span>
                            </div>

                            <div className="password-strength">
                                <div className="strength-bar" style={{ backgroundColor: strengthColors[passwordStrength] }}>
                                    {language === 'FR' ? ['Faible', 'Moyen', 'Bon', 'Fort'] : ['Weak', 'Medium', 'Good', 'Strong'][passwordStrength]}
                                </div>
                            </div>
                            {errors.password && <span className='error-message'>{errors.password}</span>}

                            {/* reCAPTCHA component */}
                            <div className="captcha-container">
                                <ReCAPTCHA
                                    sitekey={RECAPTCHA_SITE_KEY}
                                    onChange={handleCaptchaChange}
                                />
                            </div>
                            {errors.captcha && <div className="error-text">{errors.captcha}</div>}
                        </div>
                    )}
                </div>



                {/* Navigation Buttons */}
                <div className="form-navigation">
                    {step > 0 && (
                        <button className="back-button" onClick={prevStep}>
                            {language === 'FR' ? "Retour" : "Back"}
                        </button>
                    )}
                    {step < steps(language).length - 1 && (
                        <button className="next-button" onClick={() => nextStep(step)}>
                            {language === 'FR' ? "Suivant" : "Next"}
                        </button>
                    )}
                    {step === steps(language).length - 1 && (
                        <button className="submit" onClick={handleSubmit}>
                            {isLoading ? <Spinner /> : language === 'FR' ? "Soumettre" : "Submit"}
                        </button>
                    )}
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
