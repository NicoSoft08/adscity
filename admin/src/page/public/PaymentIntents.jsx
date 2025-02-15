import React, { useEffect, useState } from 'react';
import DateRangePicker from '../../components/date-range/DateRangePicker';
import { fetchPaymentStatus, updatePaymentStatus } from '../../routes/paymentRoutes';
import { formateDateTimestamp } from '../../func';
import Spinner from '../../customs/Spinner';
import Pagination from '../../components/pagination/Pagination';
import '../../styles/PaymentIntents.scss';

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

const PaymentActions = ({ payment, onStatusChange }) => {
    const [actionState, setActionState] = useState({
        validate: { loading: false, done: false },
        reject: { loading: false, done: false }
    });

    const handleAction = async (type, status) => {
        setActionState(prev => ({
            ...prev,
            [type]: { loading: true, done: false }
        }));

        await onStatusChange(payment.id, status);

        setActionState(prev => ({
            ...prev,
            [type]: { loading: false, done: true }
        }));
    };

    return (
        <div className="payment-actions">
            <button
                className={`action-btn success ${actionState.validate.done ? 'completed' : ''}`}
                onClick={() => handleAction('validate', 'completed')}
                disabled={actionState.validate.loading || actionState.validate.done}
            >
                {actionState.validate.loading ? <Spinner /> :
                    actionState.validate.done ? 'Validé' : 'Valider'}
            </button>
            <button
                className={`action-btn danger ${actionState.reject.done ? 'completed' : ''}`}
                onClick={() => handleAction('reject', 'expired')}
                disabled={actionState.reject.loading || actionState.reject.done}
            >
                {actionState.reject.loading ? <Spinner /> :
                    actionState.reject.done ? 'Rejeté' : 'Rejeter'}
            </button>
        </div>
    );
};


export default function PaymentIntents() {
    const [currentPage, setCurrentPage] = useState(1);
    const [paymentsProcessing, setPaymentsProcessing] = useState([]);
    const [payments, setPayments] = useState([]);
    const [paymentsPerPage] = useState(10);

    // Get current users
    const indexOfLastPayment = currentPage * paymentsPerPage;
    const indexOfFirstUser = indexOfLastPayment - paymentsPerPage;
    const currentPayments = payments.slice(indexOfFirstUser, indexOfLastPayment);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const paymentStatuses = {
        'completed': { color: '#34D399', label: 'Réussi' },
        'processing': { color: '#FBBF24', label: 'En cours' },
        'expired': { color: '#EF4444', label: 'Échoué' }
    };

    useEffect(() => {
        const fetchPayments = async () => {
            const data = await fetchPaymentStatus();
            if (data.success) {
                setPaymentsProcessing(data.processingPayments);
                setPayments(data.allPayments);
            }
            // const result = await fetchPaymentInfo();
            // if (result.success) {
            //     setPayments(result?.paymentData);
            // }
        };

        fetchPayments();
    }, []);

    const onDateChange = () => { }


    const onStatusChange = async (paymentId, newStatus) => {
        const updatedPayments = payments.map(payment =>
            payment.id === paymentId ? { ...payment, status: newStatus } : payment
        );
        await updatePaymentStatus(paymentId, newStatus);
        setPayments(updatedPayments?.paymentData);
    };

    return (
        <div className='payment-intents'>
            <h2>Gestion des Paiements</h2>
            <div className="payment-filters">
                <DateRangePicker onDateChange={onDateChange} />
                <select>
                    <option value="all">Tous les statuts</option>
                    <option value="processing">En Cours</option>
                    <option value="completed">Réussis</option>
                    <option value="expired">Échoués</option>
                </select>

            </div>
            <table className="payment-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Utilisateur</th>
                        <th>Plan</th>
                        <th>Montant</th>
                        <th>Méthode</th>
                        <th>Prestataire</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentPayments.length > 0 ? (
                        currentPayments.map((payment, index) => (
                            <tr key={payment.id}>
                                <td>{index + 1}</td>
                                <td>{formateDateTimestamp(payment.createdAt?._seconds)}</td>
                                <td>{payment.displayName}</td>
                                <td>{payment.subscription}</td>
                                <td>{payment.amount} RUB</td>
                                <td>{formatPaymentMethod(payment.paymentMethod)}</td>
                                <td>{payment.provider} </td>
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
                                <td>
                                    <PaymentActions
                                        payment={payment}
                                        onStatusChange={onStatusChange}
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10" align='center'>Aucunes informations de paiements.</td>
                        </tr>
                    )}
                </tbody>
            </table >
            {currentPayments.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    paymentsPerPage={paymentsPerPage}
                    elements={payments}
                    paginate={paginate}
                />
            )}
        </div >
    );
};
