import React, { useState } from 'react';
import zxcvbn from 'zxcvbn';
import { countries } from '../../data/countries';
import { Eye, EyeOff, Search } from 'lucide-react';
import cities from '../../data/ru.json';
import { Link } from 'react-router-dom';
import Toast from '../../customs/Toast';
import '../../styles/SignUpPage.scss';

const steps = ['Informations', 'Contact', 'Location', 'Sécurité'];
const strengthColors = ['red', 'orange', 'yellow', 'green'];

export default function SignUpPage() {
    const [step, setStep] = useState(0);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [selectedCountry] = useState(countries[0]);
    const [searchTerm, setSearchTerm] = useState('');

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
        agree: false,
    });

    const [errors, setErrors] = useState({});

    const validate = (currentStep) => {
        const newErrors = {};
        const { firstName, lastName, email, phoneNumber, password, confirmPassword, city, address, agree } = formData;

        if (currentStep === 0) {
            if (!firstName.trim()) newErrors.firstName = 'Prénom requis';
            if (!lastName.trim()) newErrors.lastName = 'Nom requis';
        }
        if (currentStep === 1) {
            if (!email.trim()) newErrors.email = 'Email requis';
            else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email invalide';
            if (!phoneNumber.trim()) newErrors.phoneNumber = 'Numéro requis';
            else if (!phoneNumber.trim() || phoneNumber.length < 10) newErrors.phoneNumber = 'Numéro invalide';
        }
        if (currentStep === 2) {
            if (!city.trim()) newErrors.city = 'Ville requise';
            if (!address.trim()) newErrors.address = 'Adresse requise';
        }
        if (currentStep === 3) {
            if (!agree) newErrors.agree = 'Vous devez accepter les conditions.';
            if (!password.trim() || password.length < 6) newErrors.password = 'Mot de passe trop court';
            if (password !== confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
    }

    const filteredCities = cities.filter(i => i.city.toLowerCase().includes(searchTerm.toLowerCase()));
    const passwordStrength = zxcvbn(formData.password).score;

    const nextStep = () => {
        if (validate(step)) setStep(prev => prev + 1);
    };
    const prevStep = () => setStep(step - 1);

    return (
        <div className="signup-page">
            <div className="signup-form">
                {/* Progress Bar */}
                <div className="progress-bar">
                    {steps.map((label, index) => (
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
                                placeholder='Prénom'
                                className={`input-field ${errors.firstName ? 'error' : ''}`}
                            />
                            {errors.firstName && <span className='error-message'>{errors.firstName}</span>}

                            <input
                                type='text'
                                name='lastName'
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder='Nom'
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
                                placeholder='Email'
                                className={`input-field ${errors.email ? 'error' : ''}`}
                            />
                            {errors.email && <span className='error-message'>{errors.email}</span>}

                            <input
                                type='tel'
                                name='phoneNumber'
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder='Numéro de téléphone'
                                className={`input-field ${errors.phoneNumber ? 'error' : ''}`}
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
                                placeholder='Pays'
                                className={`input-field ${errors.country ? 'error' : ''}`}
                            />
                            {errors.country && <span className='error-message'>{errors.country}</span>}

                            <div className="search-field">
                                <input
                                    type='text'
                                    name='searchTerm'
                                    placeholder='Rechercher une ville'
                                    value={searchTerm}
                                    className={`input-field ${errors.searchTerm ? 'error' : ''}`}
                                    onChange={handleSearch}
                                />
                                <span className='search-icon'>
                                    <Search size={20} />
                                </span>
                            </div>

                            <select
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={`input-field ${errors.city ? 'error' : ''}`}
                            >
                                <option value="">Choisissez votre ville</option>
                                {filteredCities.map((city, index) => (
                                    <option key={index} value={city.city}>{city.city}</option>
                                ))}
                            </select>
                            {errors.city && <span className='error-message'>{errors.city}</span>}

                            <input
                                type='text'
                                name='address'
                                value={formData.address}
                                onChange={handleChange}
                                placeholder='Adresse'
                                className={`input-field ${errors.address ? 'error' : ''}`}
                            />
                            {errors.address && <span className='error-message'>{errors.address}</span>}
                        </div>
                    )}

                    {step === 3 && (
                        <div className='form-group-item'>
                            <div className="password-field">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Mot de passe"
                                    className={`input-field ${errors.password ? 'error' : ''}`}
                                />
                                <span className='eye-icon' onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </span>
                            </div>

                            <div className="password-strength">
                                <div className="strength-bar" style={{ backgroundColor: strengthColors[passwordStrength] }}>
                                    {['Faible', 'Moyen', 'Bon', 'Fort'][passwordStrength]}
                                </div>
                            </div>
                            {errors.password && <span className='error-message'>{errors.password}</span>}

                            <div className="confirm-password-field">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirmez le mot de passe"
                                    className={`input-field ${errors.confirmPassword ? 'error' : ''}`}
                                />
                                <span className='eye-icon' onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </span>
                            </div>
                            {errors.confirmPassword && <span className='error-message'>{errors.confirmPassword}</span>}
                        </div>
                    )}
                </div>

                <input type='checkbox' id='agree' name='agree' value={formData.agree} onChange={handleChange} />
                <label htmlFor="agree" className="agree-label">En continuant, vous acceptez les Conditions d'utilisation</label>
                {errors.agree && <span className='error-message'>{errors.agree}</span>}

                {/* Navigation Buttons */}
                <div className="form-navigation">
                    {step > 0 && <button className="back-button" onClick={prevStep}>Retour</button>}
                    {step < steps.length - 1 && <button className="next-button" onClick={() => nextStep(step)}>Suivant</button>}
                    {step === steps.length - 1 && <button className="submit">S'inscrire</button>}
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
            <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />

        </div>
    );
}
