import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Toast from '../../customs/Toast';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../../customs/Spinner';
import { createUser } from '../../routes/authRoutes';
import SignupSuccessModal from '../../customs/SignupSuccessModal';
// import PhoneInput from '../../components/phone-input/PhoneInput';
import { countries } from '../../data/countries';
import '../../styles/SignUpPage.scss';
import '../../components/phone-input/PhoneInput.scss';


export default function SignUpPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isSignupSuccess, setIsSignupSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        country: '',
        city: '',
        address: '',
        password: '',
        agree: false,
    });

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const validateForm = () => {
        const errors = {};

        if (formData.agree === false) {
            errors.agree = "Vous devez accepter les termes et conditions.";
        } else {
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
            if (!formData.password) {
                errors.password = "Mot de passe réquis";
            }
            if (!formData.country) {
                errors.country = "Pays réquis";
            }
            if (!formData.city) {
                errors.city = "Ville réquis";
            }
            if (!formData.address) {
                errors.address = "Adresse réquise";
            }
        }

        return errors;
    }

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;

        if (name === 'phoneNumber') {
            // Keep only digits for phone numbers
            const numericValue = value.replace(/\D/g, '');
            setFormData({
                ...formData,
                [name]: numericValue,
            });
        } else {
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value,
            });
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

    const handleSubmit = async (e) => {
        e.preventDefault();


        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            setLoading(false);
            return;
        }

        const fullPhoneNumber = getFullPhoneNumber();


        try {
            setLoading(true);
            const {
                address, city, country,
                email, password, firstName,
                lastName,
            } = formData;

            const displayName = `${firstName} ${lastName}`;
            const result = await createUser(
                address, city, country, email,
                password, firstName, lastName,
                fullPhoneNumber, displayName
            );

            const userData = { email, displayName };

            if (result.success) {
                setIsSignupSuccess(true);
                setLoading(false);
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phoneNumber: '',
                    country: '',
                    city: '',
                    address: '',
                    password: '',
                    agree: false,
                });
                setToast({ show: true, type: 'success', message: 'Inscription réussie' });
                setTimeout(() => {
                    navigate('/auth/signup-success', { state: { userData: userData } });
                }, 3000);
            } else {
                setMessage(result.message);
                setLoading(false);
                setToast({
                    show: true,
                    type: 'error',
                    message: result.message
                });
            }
        } catch (error) {
            console.error('Inscription échouée: ', error);
            setToast({
                show: true,
                type: 'error',
                message: 'Une erreur est survenue. Veuillez réessayer.'
            });
        }
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="step-content">
                        <h2>Information Personnelle</h2>
                        <input
                            className={`input-field ${errors.firstName ? 'error' : ''}`}
                            type="text"
                            name='firstName'
                            placeholder='Entrez vos prénoms'
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                        {errors.firstName && <div className="error-text">{errors.firstName}</div>}
                        <input
                            className={`input-field ${errors.lastName ? 'error' : ''}`}
                            type="text"
                            name='lastName'
                            placeholder='Entrez votre nom de famille'
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                        {errors.lastName && <div className="error-text">{errors.lastName}</div>}
                    </div>
                )
            case 2:
                return (
                    <div className="step-content">
                        <h2>Informations de Contact</h2>
                        <input
                            className={`input-field ${errors.email ? 'error' : ''}`}
                            type='email'
                            name='email'
                            placeholder='Entrez votre email'
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
                                placeholder='Entrez votre numéro de téléphone'
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className={`input-field ${errors.phoneNumber ? 'error' : ''}`}
                            />
                        </div>
                        {errors.phoneNumber && <div className="error-text">{errors.phoneNumber}</div>}
                    </div>
                )
            case 3:
                return (
                    <div className="step-content">
                        <h2>Lieu de résidence</h2>
                        <input
                            className={`input-field ${errors.country ? 'error' : ''}`}
                            type="text"
                            name="country"
                            placeholder="Entrez votre pays"
                            value={formData.country}
                            onChange={handleChange}
                        />
                        {errors.country && <div className="error-text">{errors.country}</div>}
                        <input
                            className={`input-field ${errors.city ? 'error' : ''}`}
                            type="text"
                            name="city"
                            placeholder="Entrez votre ville"
                            value={formData.city}
                            onChange={handleChange}
                        />
                        {errors.city && <div className="error-text">{errors.city}</div>}
                        <input
                            className={`input-field ${errors.address ? 'error' : ''}`}
                            type="text"
                            name="address"
                            placeholder="Entrez votre adresse"
                            value={formData.address}
                            onChange={handleChange}
                        />
                        {errors.address && <div className="error-text">{errors.address}</div>}
                    </div>
                )
            case 4:
                return (
                    <div className="step-content password-toggle">
                        <h2>Sécurité</h2>
                        <input
                            className={`input-field ${errors.password ? 'error' : ''}`}
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name='password'
                            placeholder='Entrez votre mot de passe'
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <span onClick={toggleShowPassword}>
                            {
                                showPassword
                                    ? <FontAwesomeIcon icon={faEyeSlash} title={"Cacher"} />
                                    : <FontAwesomeIcon icon={faEye} title={"Afficher"} />
                            }
                        </span>
                        {errors.password && <div className="error-text">{errors.password}</div>}
                    </div>
                )
            default:
                return null;
        }
    }

    return (
        <div className='signup-page'>
            <div className="form">
                <div className="progress-bar">
                    {[1, 2, 3, 4].map((num) => (
                        <div
                            key={num}
                            className={`step-indicator ${step >= num ? 'active' : ''}`}
                        >
                            {num}
                        </div>
                    ))}
                </div>

                {renderStep()}

                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        name="agree"
                        checked={formData.agree}
                        onChange={handleChange}
                    />
                    J'accepte les termes et conditions
                </label>

                {errors.agree && (<div className='error-text'>{errors.agree}</div>)}
                {message && (<div className='error'>{message}</div>)}
                <div className="navigation-buttons">
                    {step > 1 && (
                        <button className='prev' onClick={prevStep}>Retour</button>
                    )}
                    {step < 4 ? (
                        <button className='next' onClick={nextStep}>Suivant</button>
                    ) : (
                        <button onClick={handleSubmit} className='submit'>
                            {loading ? <Spinner /> : "S'inscrire"}
                        </button>
                    )}
                </div>

                <p>Avez-vous déjà un compte utilisateur ? <Link to={'/auth/signin'}>Se connecter</Link></p>
            </div>

            {
                isSignupSuccess && (
                    <SignupSuccessModal
                        email={formData.email}
                        isSignupSuccess={isSignupSuccess}
                        setIsSignupSuccess={setIsSignupSuccess}
                    />
                )
            }

            {toast &&
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            }
        </div >
    )
}
