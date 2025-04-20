import React, { useEffect, useState } from 'react';
import { createAccount, deleteAccount, fetchAccounts, toggleAccountStatus } from '../../routes/paymentRoutes';
import '../../styles/PaymentAccountsManager.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Toast from '../../customs/Toast';
import Loading from '../../customs/Loading';

export default function PaymentAccountsManager() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [selectedMethod, setSelectedMethod] = useState('');
    const [selectedProvider, setSelectedProvider] = useState('');
    const [isAddingAccount, setIsAddingAccount] = useState(false);
    const [isEditingAccount, setIsEditingAccount] = useState(false);
    const [currentAccount, setCurrentAccount] = useState(null);
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        paymentMethod: '',
        provider: '',
        accountNumber: '',
        ownerName: '',
        priority: 1,
        isActive: true
    });

    // Payment methods and providers options
    const paymentMethods = [
        { value: 'bank_transfer', label: 'Transfert bancaire' },
        { value: 'mobile_money', label: 'Mobile Money' },
        { value: 'crypto', label: 'Crypto-monnaie' },
        { value: 'card_payment', label: 'Carte bancaire' }
    ];

    const providers = {
        bank_transfer: [
            { value: 'SberBank', label: 'SberBank' },
            { value: 'Tinkoff', label: 'Tinkoff' },
            { value: 'VTB', label: 'VTB' }
        ],
        mobile_money: [
            { value: 'MTN', label: 'MTN Mobile Money' },
            { value: 'Orange', label: 'Orange Money' },
            { value: 'Moov', label: 'Moov Money' }
        ],
        wallet: [
            { value: 'FlashSend', label: 'FlashSend' },
            { value: 'Wave', label: 'Wave' }
        ]
    };

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchAccounts(selectedMethod, selectedProvider);
            if (result.success) {
                setAccounts(result.accounts);
            } else {
                setToast({
                    show: true,
                    type: 'error',
                    message: result.message
                });
            }
        };

        if (selectedMethod && selectedProvider) {
            fetchData();
        }
    }, [selectedMethod, selectedProvider]);

    const handleMethodChange = (e) => {
        const method = e.target.value;
        setSelectedMethod(method);
        setSelectedProvider('');
        setAccounts([]);

        // Update form data if adding/editing
        if (isAddingAccount || isEditingAccount) {
            setFormData({
                ...formData,
                paymentMethod: method,
                provider: ''
            });
        }
    };

    const handleProviderChange = (e) => {
        const provider = e.target.value;
        setSelectedProvider(provider);

        // Update form data if adding/editing
        if (isAddingAccount || isEditingAccount) {
            setFormData({
                ...formData,
                provider: provider
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const resetForm = () => {
        setFormData({
            paymentMethod: selectedMethod,
            provider: selectedProvider,
            accountNumber: '',
            ownerName: '',
            priority: 1,
            isActive: true
        });
    };

    const handleAddAccount = () => {
        setIsAddingAccount(true);
        setIsEditingAccount(false);
        setCurrentAccount(null);
        resetForm();
    };

    const handleEditAccount = (account) => {
        setIsEditingAccount(true);
        setIsAddingAccount(false);
        setCurrentAccount(account);
        setFormData({
            paymentMethod: account.paymentMethod,
            provider: account.provider,
            accountNumber: account.accountNumber,
            ownerName: account.ownerName || '',
            priority: account.priority || 1,
            isActive: account.isActive !== undefined ? account.isActive : true
        });
    };

    const handleCancelForm = () => {
        setIsAddingAccount(false);
        setIsEditingAccount(false);
        setCurrentAccount(null);
        resetForm();
    };

    const validateForm = () => {
        if (!formData.paymentMethod) {
            setToast({ show: true, type: 'error', message: 'Veuillez sélectionner une méthode de paiement' });
            return false;
        }
        if (!formData.provider) {
            setToast({ show: true, type: 'error', message: 'Veuillez sélectionner un fournisseur' });
            return false;
        }
        if (!formData.accountNumber) {
            setToast({ show: true, type: 'error', message: 'Veuillez entrer un numéro de compte' });
            return false;
        }
        if (!formData.ownerName) {
            setToast({ show: true, type: 'error', message: 'Veuillez entrer le nom du propriétaire du compte' });
            return false;
        }
        if (!formData.priority) {
            setToast({ show: true, type: 'error', message: 'Veuillez entrer une priorité' });
            return false;
        } else if (formData.priority < 1 || formData.priority > 10) {
            setToast({ show: true, type: 'error', message: 'La priorité doit être comprise entre 1 et 10' });
            return false;
        }
        return true;
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const result = await createAccount(formData);
            if (result.success) {
                setToast({
                    show: true,
                    type: 'success',
                    message: 'Compte ajouté avec succès'
                });
                setAccounts([...accounts, result.account]);
                resetForm();
            } else {
                setToast({
                    show: true,
                    type: 'error',
                    message: result.message
                });
            }
        } catch (error) {
            console.error('Erreur lors de la soumission du formulaire :', error);
            setToast({
                show: true,
                type: 'error',
                message: 'Une erreur est survenue lors de la soumission du formulaire'
            });
        }
    };

    const handleToggleStatus = async (account) => {
        setLoading(true);

        try {
            const result = await toggleAccountStatus(account.accountID);
            if (result.success) {
                setToast({
                    show: true,
                    type: 'success',
                    message: `Le compte ${account.accountNumber} a été ${account.isActive ? 'désactivé' : 'activé'} avec succès`
                });

                // Refresh accounts list
                fetchAccounts();
            } else {
                setToast({
                    show: true,
                    type: 'error',
                    message: `Erreur lors de la ${account.isActive ? 'désactivation' : 'activation'} du compte ${account.accountNumber}`
                });
            }
        } catch (error) {
            console.error('Error toggling account status:', error);
            setToast({
                show: true,
                type: 'error',
                message: 'Erreur technique lors de l\'opération'
            });
        }
    };

    const handleDeleteAccount = async (account) => {
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ce compte ${account.accountNumber} ?`)) {
            return;
        }

        setLoading(true);

        try {
            const result = await deleteAccount(account.accountID);
            if (result.success) {
                setToast({
                    show: true,
                    type: 'success',
                    message: 'Compte supprimé avec succès'
                });

                // Refresh accounts list
                fetchAccounts();
            } else {
                setToast({
                    show: true,
                    type: 'error',
                    message: result.message || 'Erreur lors de la suppression du compte'
                });
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            setToast({
                show: true,
                type: 'error',
                message: 'Erreur technique lors de la suppression du compte'
            });
        }
    };

    const handleBack = () => {
        navigate('/admin/dashboard/payments')
    }

    return (
        <div className="payment-accounts-manager">
            <div className="head">
                <div className="back">
                    <FontAwesomeIcon icon={faChevronLeft} title='Go Back' onClick={handleBack} />
                </div>
                <div className="title">
                    <h2>Paiement /</h2>
                    <p>Comptes de Paiement</p>
                </div>
            </div>
            <div className="filter-section">
                <div className="filter-group">
                    <label>Méthode de paiement:</label>
                    <select
                        value={selectedMethod}
                        onChange={handleMethodChange}
                        disabled={loading}
                    >
                        <option value="">Sélectionner une méthode</option>
                        {paymentMethods.map(method => (
                            <option key={method.value} value={method.value}>
                                {method.label}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedMethod && (
                    <div className="filter-group">
                        <label>Fournisseur:</label>
                        <select
                            value={selectedProvider}
                            onChange={handleProviderChange}
                            disabled={loading}
                        >
                            <option value="">Sélectionner un fournisseur</option>
                            {providers[selectedMethod]?.map(provider => (
                                <option key={provider.value} value={provider.value}>
                                    {provider.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {selectedMethod && selectedProvider && (
                    <button
                        className="add-account-btn"
                        onClick={handleAddAccount}
                        disabled={loading || isAddingAccount || isEditingAccount}
                    >
                        Ajouter un compte
                    </button>
                )}
            </div>

            {(isAddingAccount || isEditingAccount) && (
                <div className="account-form-container">
                    <h3>{isAddingAccount ? 'Ajouter un compte' : 'Modifier un compte'}</h3>
                    <form onSubmit={handleSubmitForm} className="account-form">
                        <div className="form-group">
                            <label>Méthode de paiement:</label>
                            <select
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleInputChange}
                                disabled={true} // Disabled because it's set by the filter
                            >
                                <option value="">Sélectionner une méthode</option>
                                {paymentMethods.map(method => (
                                    <option key={method.value} value={method.value}>
                                        {method.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Fournisseur:</label>
                            <select
                                name="provider"
                                value={formData.provider}
                                onChange={handleInputChange}
                                disabled={true} // Disabled because it's set by the filter
                            >
                                <option value="">Sélectionner un fournisseur</option>
                                {providers[formData.paymentMethod]?.map(provider => (
                                    <option key={provider.value} value={provider.value}>
                                        {provider.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Numéro de compte:</label>
                            <input
                                type="text"
                                name="accountNumber"
                                value={formData.accountNumber}
                                onChange={handleInputChange}
                                placeholder="Numéro de compte"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Nom du titulaire:</label>
                            <input
                                type="text"
                                name="ownerName"
                                value={formData.ownerName}
                                onChange={handleInputChange}
                                placeholder="Nom du titulaire du compte"
                            />
                        </div>

                        <div className="form-group">
                            <label>Priorité (1-10):</label>
                            <input
                                type="number"
                                name="priority"
                                value={formData.priority}
                                onChange={handleInputChange}
                                min="1"
                                max="10"
                            />
                            <small>
                                Plus la priorité est élevée, plus le compte sera sélectionné fréquemment.
                            </small>
                        </div>

                        <div className="form-actions">
                            <button className="cancel-btn">Annuler</button>
                            <button type="submit" className="submit-btn">Terminé</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Accounts List Section */}
            {selectedMethod && selectedProvider && (
                <div className='table-container'>
                    {loading 
                    ? <Loading /> 
                    : accounts.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Numéro de compte</th>
                                    <th>Titulaire</th>
                                    <th>Priorité</th>
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts.map(account => (
                                    <tr key={account.id}>
                                        <td>{account.accountNumber}</td>
                                        <td>{account.ownerName || 'Non spécifié'}</td>
                                        <td>{account.priority || 1}</td>
                                        <td>
                                            <span className={`account-status ${account.isActive ? 'active' : 'suspended'}`}>
                                                {account.isActive ? 'Actif' : 'Suspendu'}
                                            </span>
                                        </td>
                                        <td className="account-actions">
                                            <button
                                                className="edit-btn"
                                                onClick={() => handleEditAccount(account)}
                                                disabled={loading || isAddingAccount || isEditingAccount}
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                className={account.isActive ? 'suspend-btn' : 'activate-btn'}
                                                onClick={() => handleToggleStatus(account)}
                                                disabled={loading}
                                            >
                                                {account.isActive ? 'Suspendre' : 'Activer'}
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDeleteAccount(account)}
                                                disabled={loading}
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="no-accounts">
                            Aucun compte trouvé pour cette méthode et ce fournisseur.
                        </div>
                    )}
                </div>
            )}

            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ show: false, ...toast })} />
        </div>
    );
}
