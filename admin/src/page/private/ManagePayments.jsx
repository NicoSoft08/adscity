import React, { useEffect, useState } from 'react';
import { fetchPaymentStatus } from '../../routes/paymentRoutes';
import { formateDateTimestamp } from '../../func';
import Spinner from '../../customs/Spinner';
import Pagination from '../../components/pagination/Pagination';
import Modal from '../../customs/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import '../../styles/ManagePayments.scss';

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

const PaymentsFilter = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
        search: '', // Par ID ou nom de l'utilisateur
        status: 'all', // "all", "completed", "processing", "expired"
        dateRange: null,
        paymentMethod: 'all', // "all", "BankTransfer", "MobileMoney", "Wallet"
        provider: 'all' // "all", "sber", "tinkoff", "vtb", "alpha"
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFilters = { ...filters, [name]: value };
        setFilters(updatedFilters);
        onFilterChange(updatedFilters);
    };

    return (
        <div className="filters">
            <input
                type="text"
                name='search'
                placeholder="Rechercher par nom ou email"
                value={filters.search}
                onChange={handleChange}
            />

            <select name='status' value={filters.status} onChange={handleChange}>
                <option value="all">Tous les statuts</option>
                <option value="completed">Completé</option>
                <option value="processing">En cours</option>
                <option value="expired">Expiré</option>
            </select>

            <select name='paymentMethod' value={filters.paymentMethod} onChange={handleChange}>
                <option value="all">Toutes les méthodes</option>
                <option value="BankTransfer">Transfert Bancaire</option>
                <option value="MobileMoney">Mobile Money</option>
                <option value="Wallet">Wallet</option>
                <option value="SBP">SBP</option>
            </select>

            <select name='provider' value={filters.provider} onChange={handleChange}>
                <option value="all">Tous les statuts</option>
                <option value="sber">Sber Bank</option>
                <option value="tinkoff">Tinkoff Bank</option>
                <option value="vtb">VTB Bank</option>
                <option value="alpha">Alpha Bank</option>
            </select>

            <input
                type="date"
                name='dateRange'
                value={filters.dateRange}
                onChange={handleChange}
            />
        </div>
    );
}

const PaymentRow = ({ index, payment, onAction, options }) => {
    const [openModal, setOpenModal] = useState(false);

    const paymentStatuses = {
        'completed': { color: '#34D399', label: 'Réussi' },
        'processing': { color: '#FBBF24', label: 'En cours' },
        'expired': { color: '#EF4444', label: 'Échoué' }
    };

    const handleActionClick = () => {
        const payID = payment.id;
        console.log(payID);
        onAction(payment);
        setOpenModal(true);
    };

    return (
        <>
            <tr>
                <td>{index + 1}</td>
                <td>{payment.PayID}</td>
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
                <td><button className="see-more" onClick={() => handleActionClick(payment)}>Détails</button></td>
            </tr>
            {openModal && (
                <Modal title={"Actions"} onShow={openModal} onHide={() => setOpenModal(false)}>
                    <div className="modal-menu">
                        {options.map((option, index) => (
                            <div key={index} className="menu-item" onClick={option.action}>
                                {/* <FontAwesomeIcon icon={option.icon} /> */}
                                <span>{option.icon}</span>
                                <span>{option.label}</span>
                            </div>
                        ))}
                    </div>
                </Modal>
            )}
        </>
    )
}

export default function ManagePayments() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [openFilter, setOpenFilter] = useState(false);
    const [paymentsProcessing, setPaymentsProcessing] = useState([]);
    const [payments, setPayments] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [paymentsPerPage] = useState(10);

    // Get current users
    const indexOfLastPayment = currentPage * paymentsPerPage;
    const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
    const currentPayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);



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

    const handleAction = (payment, action) => {
        setSelectedPayment(payment);
        setModalType(action);
    };

    const handleFilterChange = (filters) => { };

    const options = [];

    return (
        <div className='manage-payments'>
            <div className="head">
                <h2>Gestion des Paiements</h2>
                <div className='head-actions'>
                    <div className="dots-container" onClick={() => navigate('manage-payment-accounts')}>
                        <span>Gérer le Comptes de Paiement</span>
                    </div>
                    <div className="filters-container" onClick={() => setOpenFilter(!openFilter)}>
                        <FontAwesomeIcon icon={faFilter} />
                    </div>

                </div>
            </div>

            {/* Filtres */}
            {openFilter && (
                <PaymentsFilter onFilterChange={handleFilterChange} />
            )}

            <div className='table-container'>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Pay ID</th>
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
                        {currentPayments.length === 0 ? (
                            <tr>
                                <td colSpan="12">Aucun paiement trouvé.</td>
                            </tr>
                        ) : null}
                        {currentPayments.map((payment, index) => (
                            <PaymentRow
                                key={payment.id}
                                payment={payment}
                                index={index}
                                options={options}
                                onAction={(payment) => handleAction(payment)}
                            />
                        ))}
                    </tbody>
                </table >
            </div>

            {filteredPayments.length > paymentsPerPage && (
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
