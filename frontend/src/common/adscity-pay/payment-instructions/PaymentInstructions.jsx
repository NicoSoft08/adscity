import React, { useState } from 'react';
import ChronoWatch from '../../../utils/chrono-watch/ChronoWatch';
import Toast from '../../../customs/Toast';
import './PaymentInstructions.scss';

const PaymentInstructions = ({ paymentMethod, provider, amount, paymentDone }) => {
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    const renderBankInstructions = () => {
        switch (provider) {
            case 'SberBank':
                return (
                    <div>
                        <h4>Via SberBank</h4>
                        <p>Veuillez transférer le montant de <strong>{amount} RUB</strong>  vers notre compte SberBank :</p>
                        <p>Numéro de carte: <strong>2202 2063 7106 8904</strong></p>
                        <p>Nom du titulaire: <strong>Н'ДА ПЕНИЭЛЬ НИКОЛЯ</strong></p>
                    </div>
                );
            case 'Tinkoff':
                return (
                    <div>
                        <h4>Via Tinkoff</h4>
                        <p>Veuillez transférer le montant de <strong>{amount} RUB</strong> vers notre compte Tinkoff :</p>
                        <p>Numéro de carte: <strong>2200 7010 4393 2042</strong></p>
                        <p>Nom du titulaire: <strong>Н'ДА ПЕНИЭЛЬ НИКОЛЯ</strong></p>
                    </div>
                );
            case 'VTB':
                return (
                    <div>
                        <h4>Via VTB</h4>
                        <p>Veuillez transférer le montant de <strong>{amount} RUB</strong> vers notre compte VTB :</p>
                        <p>Numéro de compte: <strong>2200 2459 3642 5888</strong></p>
                        <p>Nom du titulaire: <strong>Н'ДА ПЕНИЭЛЬ НИКОЛЯ</strong></p>
                    </div>
                );
            case 'Alpha Bank':
                return (
                    <div>
                        <h4>Via Alpha Bank</h4>
                        <p>Veuillez transférer le montant de <strong>{amount} RUB</strong> vers notre compte Alpha Bank :</p>
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
                        <p>Veuillez transférer le montant de {amount} à notre numéro Orange Money :</p>
                        <p>Numéro Orange Money: 987654321</p>
                        <p>Nom du titulaire: AdsCity LLC</p>
                    </div>
                );
            case 'MTN Money':
                return (
                    <div>
                        <h3>Via MTN Money</h3>
                        <p>Veuillez transférer le montant de {amount} à notre numéro MTN Money :</p>
                        <p>Numéro MTN Money: 123456789</p>
                        <p>Nom du titulaire: AdsCity LLC</p>
                    </div>
                );
            case 'Moov Money':
                return (
                    <div>
                        <h3>Via Moov Money</h3>
                        <p>Veuillez transférer le montant de {amount} à notre numéro Moov Money :</p>
                        <p>Numéro Moov Money: 456789123</p>
                        <p>Nom du titulaire: AdsCity LLC</p>
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
                        <p>Veuillez transférer le montant de {amount} à notre portefeuille Wave :</p>
                        <p>Numéro Wave: 789456123</p>
                        <p>Nom du titulaire: AdsCity LLC</p>
                    </div>
                );
            case 'FlashSend':
                return (
                    <div>
                        <h4>Via FlashSend</h4>
                        <p>Veuillez transférer le montant de {amount} à notre portefeuille FlashSend :</p>
                        <p>Numéro FlashSend: 321654987</p>
                        <p>Nom du titulaire: AdsCity LLC</p>
                    </div>
                );
            default:
                return null;
        }
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

    const handleCopyNumberToClipboard = (receiptPhone) => {
        navigator.clipboard.writeText(receiptPhone).then(() => {
            setToast({ show: true, type: 'info', message: "Numéro copié dans le presse-papiers" });
        }).catch((error) => {
            setToast({ show: true, type: 'error', message: `Erreur lors de la copie du numéro, ${error}` })
        })
    }

    const handlePaymentDone = () => {
        paymentDone();
    };

    const handleHide = () => {
        setToast({
            ...toast,
            show: false,
        });
    };

    return (
        <div className="pay-instruction">
            <div className="instruction">
                <h3>Instructions de Paiement</h3>
                {renderInstructions()}
                <p>Effectuez le paiement dans un délai de</p>
                <div className="time-watch">
                    <ChronoWatch />
                </div>
                <div className='btns-btn'>
                    <button id='copy-number' onClick={handleCopyNumberToClipboard}>Copier le numéro</button>
                    <button id='deposit-done' onClick={handlePaymentDone}>Paiement Effectué</button>
                </div>
                <Toast
                    show={toast.show}
                    type={toast.type}
                    message={toast.message}
                    onClose={handleHide}
                />
            </div>
        </div>
    );
}

export default PaymentInstructions;