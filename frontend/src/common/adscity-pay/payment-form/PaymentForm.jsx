import React, { useState } from 'react';
import './PaymentForm.scss';
import Spinner from '../../../customs/Spinner';

const PaymentForm = ({ onSubmit, amount, subscription, userData, provider, setProvider, paymentMethod, setPaymentMethod }) => {
    const { firstName, lastName, email, phoneNumber } = userData;
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState({
        firstName: firstName || '',
        lastName: lastName || '',
        email: email || '',
        phoneNumber: phoneNumber || '',
    });


    const validateForm = () => {
        const newErrors = {};
        if (!paymentMethod) {
            newErrors.paymentMethod = "Veuillez choisir une méthode de paiement.";
        } else if (!provider) {
            newErrors.provider = "Veuillez choisir un mode de paiement.";
        }

        if (!paymentInfo.firstName) {
            newErrors.firstName = "Veuillez saisir votre prénom.";
        }
        if (!paymentInfo.lastName) {
            newErrors.lastName = "Veuillez saisir votre nom de famille.";
        }
        if (!paymentInfo.email) {
            newErrors.email = "Veuillez saisir votre email.";
        }
        if (!paymentInfo.email.match(/^\S+@\S+\.\S+$/)) {
            newErrors.email = "Veuillez saisir une adresse email valide.";
        }
        if (!paymentInfo.phoneNumber) {
            newErrors.phoneNumber = "Veuillez saisir votre numéro de téléphone.";
        }
        return newErrors;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaymentInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
    };

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
        setProvider('');
    };

    const handleProviderChange = (e) => {
        setProvider(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setError(formErrors);
            setLoading(false);
            return;
        } else {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                onSubmit(paymentMethod, { ...paymentInfo, provider });
            }, 2000);
            setError({});
        }
    };

    return (
        <div className="adscity-pay">
            <div className="pay-modal">
                <form onSubmit={handleSubmit}>
                    <h3>Choisissez votre mode de paiement</h3>
                    <div className='payment-method'>
                        <label>
                            <input
                                type="radio"
                                value="BankTransfer"
                                checked={paymentMethod === 'BankTransfer'}
                                onChange={handlePaymentMethodChange}
                            />
                            Virement bancaire
                        </label>
                        {paymentMethod === 'BankTransfer' && (
                            <div className='payment-select-provider'>
                                <select value={provider} onChange={handleProviderChange}>
                                    <option value="" disabled>Choisissez une banque</option>
                                    <option value="SberBank">SberBank</option>
                                    <option value="Tinkoff">Tinkoff</option>
                                    <option value="VTB">VTB</option>
                                    <option value="Alpha Bank">Alpha Bank</option>
                                </select>
                                {error.provider && <div className='error-message'>{error.provider}</div>}
                            </div>
                        )}
                    </div>
                    {/* <div className='payment-method'>
                        <label>
                            <input
                                type="radio"
                                value="MobileMoney"
                                checked={paymentMethod === 'MobileMoney'}
                                onChange={handlePaymentMethodChange}
                            />
                            Mobile Money
                        </label>
                        {paymentMethod === 'MobileMoney' && (
                            <div className='payment-select-provider'>
                                <select value={provider} onChange={handleProviderChange}>
                                    <option value="" disabled>Choisissez un fournisseur</option>
                                    <option value="Orange Money">Orange Money</option>
                                    <option value="MTN Money">MTN Money</option>
                                    <option value="Moov Money">Moov Money</option>
                                </select>
                                {error.provider && <div className='error-message'>{error.provider}</div>}
                            </div>
                        )}
                    </div>
                    <div className='payment-method'>
                        <label>
                            <input
                                type="radio"
                                value="Wallet"
                                checked={paymentMethod === 'Wallet'}
                                onChange={handlePaymentMethodChange}
                            />
                            Wallet
                        </label>
                        {paymentMethod === 'Wallet' && (
                            <div className='payment-select-provider'>
                                <select value={provider} onChange={handleProviderChange}>
                                    <option value="" disabled>Choisissez un portefeuille</option>
                                    <option value="Wave">Wave</option>
                                    <option value="FlashSend">FlashSend</option>
                                </select>
                                {error.provider && <div className='error-message'>{error.provider}</div>}
                            </div>
                        )}
                    </div>*/}
                    {error.paymentMethod && <div className="error-message">{error.paymentMethod}</div>}

                    <h3>Informations de paiement</h3>
                    <div className='payment-info'>
                        <label>
                            Prénom
                            <input
                                type="text"
                                name="lastName"
                                value={paymentInfo.lastName}
                                onChange={handleChange}
                            />
                        </label>
                        {error.lastName && <div className="error-message">{error.lastName}</div>}
                        <label>
                            Nom de famille
                            <input
                                type="text"
                                name="firstName"
                                value={paymentInfo.firstName}
                                onChange={handleChange}
                            />
                        </label>
                        {error.firstName && <div className="error-message">{error.firstName}</div>}
                    </div>
                    <div className='payment-info'>
                        <label>
                            Email
                            <input
                                type="email"
                                name="email"
                                value={paymentInfo.email}
                                onChange={handleChange}
                            />
                        </label>
                        {error.email && <div className="error-message">{error.email}</div>}
                        <label>
                            Téléphone
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={paymentInfo.phoneNumber}
                                onChange={handleChange}
                            />
                        </label>
                        {error.phoneNumber && <div className="error-message">{error.phoneNumber}</div>}
                    </div>
                    <div className="payment-info">
                        <label>
                            Souscription
                            <input
                                type="text"
                                name="subscription"
                                value={"Forfait " + subscription}
                                onChange={handleChange}
                                readOnly
                            />
                        </label>
                        <label>
                            Montant
                            <input
                                type="text"
                                name="amount"
                                value={amount + " RUB"}
                                onChange={handleChange}
                                readOnly
                            />
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="submit-btn">
                        {loading
                            ? <Spinner />
                            : "Soumettre"
                        }
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PaymentForm;