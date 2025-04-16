import React, { useEffect, useState } from 'react';
import ChronoWatch from '../../../utils/chrono-watch/ChronoWatch';
import Toast from '../../../customs/Toast';
import './PaymentInstructions.scss';

const PaymentInstructions = ({ paymentMethod, provider, amount, paymentDone, paymentID }) => {
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [isExpired, setIsExpired] = useState(false);

    // Store payment details in localStorage when component mounts
    useEffect(() => {
        // Save current payment details to localStorage
        if (paymentID) {
            localStorage.setItem('current_payment_id', paymentID);
            localStorage.setItem('current_payment_method', paymentMethod);
            localStorage.setItem('current_payment_provider', provider);
            localStorage.setItem('current_payment_amount', amount);
        }

        // Clean up function to remove payment details when component unmounts
        return () => {
            // Only clear if this payment ID matches the stored one
            if (paymentID && localStorage.getItem('current_payment_id') === paymentID) {
                localStorage.removeItem('current_payment_id');
                localStorage.removeItem('current_payment_method');
                localStorage.removeItem('current_payment_provider');
                localStorage.removeItem('current_payment_amount');
                localStorage.removeItem('chrono_timer_id');
                localStorage.removeItem('chrono_start_time_timer_id');
                localStorage.removeItem('chrono_end_time_timer_id');
            }
        };
    }, [paymentID, paymentMethod, provider, amount]);

    const renderBankInstructions = () => {
        switch (provider) {
            case 'SberBank':
                return (
                    <div>
                        <h4>Via SberBank</h4>
                        <p>Veuillez transférer le montant de <strong>{amount} RUB</strong>  vers notre compte <strong>SberBank</strong> :</p>
                        <p>Numéro de carte: <strong>2202 2063 7106 8904</strong></p>
                        <p>Nom du titulaire: <strong>Н'ДА ПЕНИЭЛЬ НИКОЛЯ</strong></p>
                    </div>
                );
            case 'Tinkoff':
                return (
                    <div>
                        <h4>Via Tinkoff</h4>
                        <p>Veuillez transférer le montant de <strong>{amount} RUB</strong> vers notre compte <strong>Tinkoff</strong> :</p>
                        <p>Numéro de carte: <strong>2200 7010 4393 2042</strong></p>
                        <p>Nom du titulaire: <strong>Н'ДА ПЕНИЭЛЬ НИКОЛЯ</strong></p>
                    </div>
                );
            case 'VTB':
                return (
                    <div>
                        <h4>Via VTB</h4>
                        <p>Veuillez transférer le montant de <strong>{amount} RUB</strong> vers notre compte <strong>VTB</strong> :</p>
                        <p>Numéro de compte: <strong>2200 2459 3642 5888</strong></p>
                        <p>Nom du titulaire: <strong>Н'ДА ПЕНИЭЛЬ НИКОЛЯ</strong></p>
                    </div>
                );
            case 'Alpha Bank':
                return (
                    <div>
                        <h4>Via Alpha Bank</h4>
                        <p>Veuillez transférer le montant de <strong>{amount} RUB</strong> vers notre compte <strong>Alpha Bank</strong> :</p>
                        <p>Numéro de compte: <strong>2200 1529 5626 6467</strong></p>
                        <p>Nom du titulaire: <strong>Н'ДА ПЕНИЭЛЬ НИКОЛЯ</strong></p>
                    </div>
                );
            default:
                return null;
        }
    }

    const renderMobileMoneyInstructions = () => {
        switch (provider) {
            case 'Orange Money':
                return (
                    <div>
                        <h3>Via Orange Money</h3>
                        <p>Veuillez transférer le montant de {amount} à notre numéro <strong>Orange Money</strong> :</p>
                        <p>Numéro Orange Money: <strong>987654321</strong> </p>
                        <p>Nom du titulaire: <strong>AdsCity LLC</strong> </p>
                    </div>
                );
            case 'MTN Money':
                return (
                    <div>
                        <h3>Via MTN Money</h3>
                        <p>Veuillez transférer le montant de {amount} à notre numéro <strong>MTN Money</strong> :</p>
                        <p>Numéro MTN Money: <strong>123456789</strong> </p>
                        <p>Nom du titulaire: <strong>AdsCity LLC</strong> </p>
                    </div>
                );
            case 'Moov Money':
                return (
                    <div>
                        <h3>Via Moov Money</h3>
                        <p>Veuillez transférer le montant de {amount} à notre numéro <strong>Moov Money</strong> :</p>
                        <p>Numéro Moov Money: <strong>456789123</strong> </p>
                        <p>Nom du titulaire: <strong>AdsCity LLC</strong> </p>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderWalletInstructions = () => {
        switch (provider) {
            case 'Wave':
                return (
                    <div>
                        <h4>Via Wave</h4>
                        <p>Veuillez transférer le montant de {amount} à notre portefeuille <strong>Wave</strong> :</p>
                        <p>Numéro Wave: <strong>789456123</strong> </p>
                        <p>Nom du titulaire: <strong>AdsCity LLC</strong> </p>
                    </div>
                );
            case 'FlashSend':
                return (
                    <div>
                        <h4>Via FlashSend</h4>
                        <p>Veuillez transférer le montant de {amount} à notre portefeuille <strong>FlashSend</strong> :</p>
                        <p>Numéro FlashSend: <strong>321654987</strong> </p>
                        <p>Nom du titulaire: <strong>AdsCity LLC</strong> </p>
                    </div>
                );
            default:
                return null;
        }
    };

    const handleTimeUp = () => {
        setIsExpired(true);
        setToast({
            show: true,
            type: 'warning',
            message: "Le délai de paiement a expiré. Veuillez recommencer le processus."
        });
    };

    const renderInstructions = () => {
        switch (paymentMethod) {
            case 'BankTransfer':
                return renderBankInstructions();
            case 'MobileMoney':
                return renderMobileMoneyInstructions();
            case 'Wallet':
                return renderWalletInstructions();
            default:
                return null;
        }
    };

    const handleCopyNumberToClipboard = () => {
        let accountNumber = '';

        // Determine which number to copy based on provider
        switch (provider) {
            case 'SberBank':
                accountNumber = '2202 2063 7106 8904';
                break;
            case 'Tinkoff':
                accountNumber = '2200 7010 4393 2042';
                break;
            // Add other cases for each provider
            default:
                accountNumber = '';
        }

        if (accountNumber) {
            navigator.clipboard.writeText(accountNumber).then(() => {
                setToast({ show: true, type: 'info', message: "Numéro copié dans le presse-papiers" });
            }).catch((error) => {
                setToast({ show: true, type: 'error', message: `Erreur lors de la copie du numéro, ${error}` });
            });
        } else {
            setToast({ show: true, type: 'error', message: "Aucun numéro disponible pour ce fournisseur" });
        }
    }

    return (
        <div className="pay-instruction">
            <div className="instruction">
                <h3>Instructions de Paiement</h3>
                {renderInstructions()}
                <p>Effectuez le paiement dans un délai de</p>
                <div className="time-watch">
                    <ChronoWatch
                        initialMinutes={15}
                        onTimeUp={handleTimeUp}
                    />
                </div>
                <div className='btns-btn'>
                    <button id='copy-number' onClick={handleCopyNumberToClipboard}>Copier le numéro</button>
                    <button id='deposit-done' onClick={paymentDone}>Paiement Effectué</button>
                </div>
                <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
            </div>
        </div>
    );
}

export default PaymentInstructions;