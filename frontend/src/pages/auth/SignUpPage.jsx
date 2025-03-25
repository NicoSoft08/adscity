import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Toast from '../../customs/Toast';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../../customs/Spinner';
import { createUser } from '../../routes/authRoutes';
import SignupSuccessModal from '../../customs/SignupSuccessModal';
// import PhoneInput from '../../components/phone-input/PhoneInput';
import { countries } from '../../data/countries';
import citiesData from '../../data/ru.json'
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
    const [cities, setCities] = useState([]);
    const [selectedLetter, setSelectedLetter] = useState('');
    const [formData, setFormData] = useState({
        firstName: '', lastName: '',
        email: '', phoneNumber: '',
        country: selectedCountry.name, city: '', address: '',
        password: '', agree: false,
    });

    useEffect(() => {
        if (selectedCountry) {
            setCities(citiesData.filter(city => city.countryCode === selectedCountry.code));
        }
    }, [selectedCountry]);

    const validateStep = () => {
        let errors = {};
        if (step === 1) {
            if (!formData.firstName.trim()) errors.firstName = "Le prénom est requis";
            if (!formData.lastName.trim()) errors.lastName = "Le nom est requis";
        }
        if (step === 2) {
            if (!formData.email.includes("@")) errors.email = "Email invalide";
            if (!formData.phoneNumber.trim()) errors.phoneNumber = "Numéro requis";
        }
        if (step === 3) {
            if (!formData.city) errors.city = "Ville requise";
            if (!formData.address.trim()) errors.address = "Adresse requise";
        }
        if (step === 4) {
            if (formData.password.length < 6) errors.password = "Mot de passe trop court";
        }
    
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };
    
    const nextStep = () => {
        if (validateStep()) setStep(step + 1);
    };
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
                errors.firstName = "Prénoms requis";
            }

            if (!formData.lastName) {
                errors.lastName = "Nom de famille requis";
            }

            if (!formData.phoneNumber) {
                errors.phoneNumber = "Numéro de téléphone requis";
            }

            if (!formData.email) {
                errors.email = "Email requis";
            }

            if (!formData.password) {
                errors.password = "Mot de passe requis";
            }

            if (!formData.country) {
                errors.country = "Pays requis";
            }

            if (!formData.city) {
                errors.city = "Ville requise";
            }

            if (!formData.address) {
                errors.address = "Adresse requise";
            }
        }

        return errors;
    };

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;

        // Autoriser uniquement les lettres latines et les espaces
        const latinOnlyRegex = /^[A-Za-z\s']*$/;

        // Vérification pour firstName et lastName
        if ((name === 'firstName' || name === 'lastName') && !latinOnlyRegex.test(value)) {
            setToast({ show: true, type: 'error', message: 'Ne sont autorisés que des caractères latins' });
            return; // Ignore l'entrée si elle contient des caractères cyrilliques
        }

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

        setErrors({});  // Réinitialisation des erreurs
        setLoading(true);


        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            setLoading(false);
            return;
        }

        const fullPhoneNumber = getFullPhoneNumber();


        try {
            setLoading(true);
            const { address, city, country, email, password, firstName, lastName } = formData;

            const displayName = `${firstName} ${lastName}`;
            const result = await createUser(address, city, country, email, password, firstName, lastName, fullPhoneNumber, displayName);

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
                setToast({ show: true, type: 'error', message: result.message });
            }
        } catch (error) {
            console.error('Inscription échouée: ', error);
            setToast({ show: true, type: 'error', message: 'Une erreur est survenue. Veuillez réessayer.' });
        } finally {
            setLoading(false);
        }
    }

    const handleLetterChange = (event) => {
        const letter = event.target.value.toUpperCase();
        setSelectedLetter(letter);
        setCities(citiesData.filter(city => city.city.toUpperCase().startsWith(letter)));
    };

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
                )
            case 2:
                return (
                    <div className="step-content">
                        <h2>Informations de Contact</h2>
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
                                title='Téléphone (sans préfix)'
                                type='tel'
                                name='phoneNumber'
                                placeholder='Téléphone (sans préfix)'
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
                            placeholder="Pays"
                            value={formData.country}
                            readOnly
                            onChange={handleChange}
                        />
                        {errors.country && <div className="error-text">{errors.country}</div>}

                        <select onChange={handleLetterChange}>
                            <option value="">Lettre initiale de la ville</option>
                            {[...Array(26)].map((_, index) => {
                                const letter = String.fromCharCode(65 + index);
                                return <option key={letter} value={letter}>{letter}</option>;
                            })}
                        </select>

                        {selectedLetter && (
                            <select
                                id="city-select"
                                name='city'
                                className={`input-field ${errors.city ? 'error' : ''}`}
                                value={formData.city}
                                onChange={handleChange}
                            >
                                <option value="">Ville</option>
                                {cities.map((city, index) => (
                                    <option key={index} value={city.city}>
                                        {city.city}
                                    </option>
                                ))}
                            </select>
                        )}
                        {errors.city && <div className="error-text">{errors.city}</div>}

                        <input
                            className={`input-field ${errors.address ? 'error' : ''}`}
                            type="text"
                            name="address"
                            placeholder="Adresse"
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
                            placeholder='Mot de passe'
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
            <div className="signup-form">
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

                <div className="terms-container">
                    <p>
                        <Link to="/legal/privacy-policy" target="_blank">Confidentialité</Link>{" - "}
                        <Link to="/legal/terms" target="_blank">Conditions d'utilisation</Link>
                        {/* <Link to="/data-processing" target="_blank">Politique de traitement des données</Link>. */}
                    </p>
                </div>
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
                    show={toast.show}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            }
        </div >
    )
}
