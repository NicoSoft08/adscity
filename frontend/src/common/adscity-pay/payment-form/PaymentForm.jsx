import React, { useState, useEffect } from 'react';
import Spinner from '../../../customs/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUniversity, faInfoCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import Toast from '../../../customs/Toast';
import './PaymentForm.scss';

const PaymentForm = ({
    onSubmit,
    amount,
    subscription,
    userData,
    provider,
    setProvider,
    paymentMethod,
    paymentMethods,
    setPaymentMethod
}) => {
    const { firstName, lastName, email, phoneNumber } = userData;

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState({});
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    const [paymentInfo, setPaymentInfo] = useState({
        firstName: firstName || '',
        lastName: lastName || '',
        email: email || '',
        phoneNumber: phoneNumber || '',
    });

    // Get the current payment method configuration
    const currentPaymentMethod = paymentMethods?.find(method => method.id === paymentMethod);

    // Validate a single field
    const validateField = (name, value) => {
        switch (name) {
            case 'firstName':
                return value?.trim() ? '' : 'Veuillez saisir votre prénom';
            case 'lastName':
                return value?.trim() ? '' : 'Veuillez saisir votre nom de famille';
            case 'email':
                return value?.trim() 
                    ? (/^\S+@\S+\.\S+$/.test(value) ? '' : 'Veuillez saisir une adresse email valide')
                    : 'Veuillez saisir votre email';
            case 'phoneNumber':
                return value?.trim() ? '' : 'Veuillez saisir votre numéro de téléphone';
            case 'paymentMethod':
                return value ? '' : 'Veuillez choisir un mode de paiement';
            case 'provider':
                return value ? '' : 'Veuillez choisir un fournisseur';
            default:
                return '';
        }
    };

    // Validate the entire form
    const validateForm = () => {
        const newErrors = {};

        // Validate payment method and provider
        newErrors.paymentMethod = validateField('paymentMethod', paymentMethod);
        if (paymentMethod && currentPaymentMethod?.providers?.length > 0) {
            newErrors.provider = validateField('provider', provider);
        }

        // Validate personal information fields
        Object.keys(paymentInfo).forEach(field => {
            newErrors[field] = validateField(field, paymentInfo[field]);
        });

        // Filter out empty error messages
        return Object.fromEntries(
            Object.entries(newErrors).filter(([_, value]) => value !== '')
        );
    };

    // Handle field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaymentInfo(prev => ({ ...prev, [name]: value }));

        // Mark field as touched
        setTouched(prev => ({ ...prev, [name]: true }));

        // Validate the field if it's been touched
        if (touched[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: validateField(name, value)
            }));
        }
    };

    // Handle payment method selection
    const handlePaymentMethodChange = (e) => {
        const methodId = e.target.value;
        setPaymentMethod(methodId);
        setProvider(''); // Reset provider when payment method changes

        // Mark payment method as touched
        setTouched(prev => ({ ...prev, paymentMethod: true }));

        // Validate payment method
        setErrors(prev => ({
            ...prev,
            paymentMethod: validateField('paymentMethod', methodId),
            provider: 'Veuillez choisir un mode de paiement'
        }));
        setToast({ show: true, type: 'error', message: 'Veuillez choisir un mode de paiement' });
    };

    // Handle form submission
    const handleSubmit = () => {
        // Mark all fields as touched
        const allTouched = {};
        [...Object.keys(paymentInfo), 'paymentMethod', 'provider'].forEach(field => {
            allTouched[field] = true;
        });
        setTouched(allTouched);

        // Validate the form
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            // Show a toast for the first error
            const firstError = Object.values(formErrors)[0];
            setToast({ show: true, type: 'error', message: firstError });
            return;
        }

        // Submit the form if valid
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onSubmit(paymentMethod, { ...paymentInfo, provider });
        }, 2000);
    };


    // Validate on initial load
    useEffect(() => {
        const initialErrors = {};
        if (paymentMethod) {
            initialErrors.paymentMethod = validateField('paymentMethod', paymentMethod);
            if (currentPaymentMethod?.providers?.length > 0 && !provider) {
                initialErrors.provider = validateField('provider', provider);
            }
        }
        setErrors(initialErrors);
    }, [currentPaymentMethod, paymentMethod, provider]);

    return (
        <div className="adscity-pay">
            <div className="pay-modal">
                <div className='form'>
                    <h3 className="section-title">
                        <FontAwesomeIcon icon={faUniversity} className="section-icon" />
                        Choisissez un mode de paiement
                    </h3>

                    <div className="payment-methods-container">
                        {paymentMethods.map(method => (
                            <div className="payment-method" key={method.id}>
                                <label className={`method-label ${paymentMethod === method.id ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        value={method.id}
                                        checked={paymentMethod === method.id}
                                        onChange={handlePaymentMethodChange}
                                        className="method-radio"
                                    />
                                    <FontAwesomeIcon icon={method.icon} className="method-icon" />
                                    <span className="method-name">{method.label}</span>
                                </label>

                                {paymentMethod === method.id && method.providers.length > 0 && (
                                    <div className="payment-select-provider">
                                        <div className={`custom-select ${errors.provider ? 'error' : ''}`}>
                                            <div className="select-selected" onClick={() => setDropdownOpen(!dropdownOpen)}>
                                                {provider ? (
                                                    <div className="provider-option">
                                                        {method.providers.find(p => p.id === provider)?.icon && (
                                                            <img
                                                                src={method.providers.find(p => p.id === provider)?.icon}
                                                                alt={provider}
                                                                className="provider-icon"
                                                            />
                                                        )}
                                                        <span>{method.providers.find(p => p.id === provider)?.name || "Choisissez un fournisseur"}</span>
                                                    </div>
                                                ) : (
                                                    "Choisissez un fournisseur"
                                                )}
                                            </div>

                                            {dropdownOpen && (
                                                <div className="select-items">
                                                    {method.providers.map(p => (
                                                        <div
                                                            key={p.id}
                                                            className={`provider-option ${provider === p.id ? 'selected' : ''}`}
                                                            onClick={() => {
                                                                setProvider(p.id);
                                                                setDropdownOpen(false);
                                                                setTouched(prev => ({ ...prev, provider: true }));
                                                                setErrors(prev => ({
                                                                    ...prev,
                                                                    provider: validateField('provider', p.id)
                                                                }));
                                                            }}
                                                        >
                                                            {p.icon && <img src={p.icon} alt={p.name} className="provider-icon" />}
                                                            <span>{p.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {errors.provider && (
                                            <div className="error-message">
                                                <FontAwesomeIcon icon={faExclamationCircle} />
                                                {errors.provider}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {errors.paymentMethod && (
                        <div className="error-message payment-method-error">
                            <FontAwesomeIcon icon={faExclamationCircle} />
                            {errors.paymentMethod}
                        </div>
                    )}

                    <h3 className="section-title">
                        <FontAwesomeIcon icon={faInfoCircle} className="section-icon" />
                        Informations de paiement
                    </h3>

                    <div className="payment-info-container">
                        <div className="payment-info">
                            <label className="info-label">
                                Prénom
                                <input
                                    type="text"
                                    name="firstName"
                                    value={paymentInfo.firstName}
                                    onChange={handleChange}
                                    className={errors.firstName ? 'error' : ''}
                                    placeholder="Votre prénom"
                                />
                                {errors.firstName && (
                                    <div className="error-message">
                                        <FontAwesomeIcon icon={faExclamationCircle} />
                                        {errors.firstName}
                                    </div>
                                )}
                            </label>

                            <label className="info-label">
                                Nom de famille
                                <input
                                    type="text"
                                    name="lastName"
                                    value={paymentInfo.lastName}
                                    onChange={handleChange}
                                    className={errors.lastName ? 'error' : ''}
                                    placeholder="Votre nom de famille"
                                />
                                {errors.lastName && (
                                    <div className="error-message">
                                        <FontAwesomeIcon icon={faExclamationCircle} />
                                        {errors.lastName}
                                    </div>
                                )}
                            </label>
                        </div>

                        <div className="payment-info">
                            <label className="info-label">
                                Email
                                <input
                                    type="email"
                                    name="email"
                                    value={paymentInfo.email}
                                    onChange={handleChange}
                                    className={errors.email ? 'error' : ''}
                                    placeholder="votre@email.com"
                                />
                                {errors.email && (
                                    <div className="error-message">
                                        <FontAwesomeIcon icon={faExclamationCircle} />
                                        {errors.email}
                                    </div>
                                )}
                            </label>

                            <label className="info-label">
                                Téléphone
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={paymentInfo.phoneNumber}
                                    onChange={handleChange}
                                    className={errors.phoneNumber ? 'error' : ''}
                                    placeholder="+7 (XXX) XXX-XXXX"
                                />
                                {errors.phoneNumber && (
                                    <div className="error-message">
                                        <FontAwesomeIcon icon={faExclamationCircle} />
                                        {errors.phoneNumber}
                                    </div>
                                )}
                            </label>
                        </div>

                        <div className="payment-info">
                            <label className="info-label">
                                Souscription
                                <input
                                    type="text"
                                    name="subscription"
                                    value={"Forfait " + subscription}
                                    readOnly
                                    className="readonly-field"
                                />
                            </label>

                            <label className="info-label">
                                Montant
                                <input
                                    type="text"
                                    name="amount"
                                    value={amount + " RUB"}
                                    readOnly
                                    className="readonly-field amount-field"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="payment-terms">
                        <p>
                            En cliquant sur "Continuer", vous acceptez nos conditions générales
                            de vente et notre politique de confidentialité.
                        </p>
                    </div>

                    <button type="button" onClick={handleSubmit} className="submit-btn" disabled={loading}>
                        {loading ? <Spinner /> : "Continuer"}
                    </button>
                </div>
            </div>

            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
};

export default PaymentForm;
