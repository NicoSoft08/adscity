import React, { useEffect, useState } from 'react';
import { formateDateTimestamp } from '../../func';
import './PaymentIntents.scss';
import { fetchUserPaymentInfo } from '../../services/paymentServices';


const formatPaymentMethod = (paymentMethod) => {
    switch (paymentMethod) {
        case 'BankTransfer':
            return 'Virement bancaire';
        case 'MobileMoney':
            return 'Mobile Money';
        case 'Wallet':
            return 'Portefeuille';
        default:
            return paymentMethod;
    }
};

export default function PaymentIntents({ userID }) {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const fetchPayments = async () => {
            const response = await fetchUserPaymentInfo(userID);
            setPayments(response.paymentData);
        };

        fetchPayments();
    }, [userID]);

    const paymentStatuses = {
        'completed': { color: '#34D399', label: 'Réussi' },
        'processing': { color: '#FBBF24', label: 'En cours' },
        'failed': { color: '#EF4444', label: 'Échoués' }
    };
    return (
        <div className='payment-intents'>
            <h2>Mes Paiements</h2>
            <table className="payment-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Plan</th>
                        <th>Montant</th>
                        <th>Méthode</th>
                        <th>Prestataire</th>
                        <th>Statut</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.length > 0 ? (
                        payments.map((payment, index) => (
                            <tr key={payment.id}>
                                <td>{index + 1}</td>
                                <td>{formateDateTimestamp(payment.createdAt?._seconds)}</td>
                                <td>{payment.subscription}</td>
                                <td>{payment.amount} RUB</td>
                                <td>{formatPaymentMethod(payment.paymentMethod)}</td>
                                <td>{payment.provider}</td>
                                <td>
                                    <span
                                        style={{
                                            backgroundColor: paymentStatuses[payment.status].color,
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            color: 'white'
                                        }}
                                    >
                                        {paymentStatuses[payment.status].label}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">Aucun paiement trouvé.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
