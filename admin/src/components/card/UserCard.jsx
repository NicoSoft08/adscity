import React, { useContext, useEffect, useRef, useState } from 'react';
import { Activity, CheckCircle2, CreditCard, Files, Info, UserCircle } from 'lucide-react';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// Import the PDF worker directly
import { differenceInDays, format } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { getUserIDLoginActivity, updateUserVerificationStatus } from '../../routes/userRoutes';
import { AuthContext } from '../../contexts/AuthContext';
import Toast from '../../customs/Toast';
import '../../styles/UserCard.scss';
import { LanguageContext } from '../../contexts/LanguageContext';
import Spinner from '../../customs/Spinner';

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PersonalInformation = ({ userData, language }) => {
    // Format date function
    const formatDate = (dateValue) => {
        if (!dateValue) return language === 'FR' ? 'Non spécifié' : 'Not specified';

        let date;

        // Handle Firestore Timestamp
        if (dateValue && typeof dateValue._seconds === 'number') {
            date = new Date(dateValue._seconds * 1000);
        }
        // Handle regular timestamp (seconds)
        else if (typeof dateValue === 'number') {
            date = new Date(dateValue * 1000);
        }
        // Handle string or Date object
        else {
            date = new Date(dateValue);
        }

        if (isNaN(date.getTime())) {
            return language === 'FR' ? 'Date invalide' : 'Invalid date';
        }

        return format(date, "d MMMM yyyy HH:mm", { locale: language === 'FR' ? fr : enUS });
    };

    return (
        <div className='tab-content'>
            <div className="tab-name">
                {language === 'FR' ? "Renseignements Personnels" : "Personal Information"}
            </div>

            <div className="user-info-container">
                <div className="info-section">
                    <div className="info-row">
                        <div className="info-label">{language === 'FR' ? "Nom complet" : "Full Name"}</div>
                        <div className="info-value">{userData?.firstName || 'Non spécifié'} {userData?.lastName || 'Non spécifié'}</div>
                    </div>

                    <div className="info-row">
                        <div className="info-label">{language === 'FR' ? "Pays" : "Country"}</div>
                        <div className="info-value">{userData?.country || 'Non spécifié'}</div>
                    </div>

                    <div className="info-row">
                        <div className="info-label">{language === 'FR' ? "Ville" : "City"}</div>
                        <div className="info-value">{userData?.city || 'Non spécifié'}</div>
                    </div>
                </div>

                <div className="info-section">
                    <div className="info-row">
                        <div className="info-label">{language === 'FR' ? "Téléphone" : "Phone Number"}</div>
                        <div className="info-value">{userData?.phoneNumber || 'Non spécifié'}</div>
                    </div>

                    <div className="info-row">
                        <div className="info-label">{language === 'FR' ? "Email" : "Email Address"}</div>
                        <div className="info-value">{userData?.email || 'Non spécifié'} {userData?.emailVerified ? <CheckCircle2 size={14} /> : <Info size={14} />} </div>
                    </div>

                    <div className="info-row">
                        <div className="info-label">{language === 'FR' ? "Adresse" : "Address"}</div>
                        <div className="info-value">{userData?.address || 'Non spécifié'}</div>
                    </div>
                </div>
            </div>

            <div className="additional-info">
                <div className="info-section">
                    <div className="section-title">{language === 'FR' ? "Informations complémentaires" : "Additional information"}</div>

                    <div className="info-row">
                        <div className="info-label">{language === 'FR' ? "Date d'inscription" : "Registration date"}</div>
                        <div className="info-value">{formatDate(userData?.createdAt?._seconds)}</div>
                    </div>

                    <div className="info-row">
                        <div className="info-label">{language === 'FR' ? "Méthode d'inscription" : "Registration method"}</div>
                        <div className="info-value">{language === 'FR' ? "Email & Mot de Passe" : "Email & Password"}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DocumentVerification = ({ currentUser, userData, user, setToast, language }) => {
    const [loading, setLoading] = useState({ identity: true, selfie: true });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    // Handle image loading state
    const handleImageLoaded = (type) => {
        setLoading(prev => ({ ...prev, [type]: false }));
    };

    // Handle image error
    const handleImageError = (type) => {
        setLoading(prev => ({ ...prev, [type]: false }));
        console.error(`Error loading ${type} image`);
    };

    // Check if a URL is for a PDF file
    const isPdfUrl = (url) => {
        if (!url) return false;
        return url.toLowerCase().includes('.pdf') ||
            url.toLowerCase().includes('application/pdf') ||
            url.includes('_document');  // Based on your URL pattern
    };

    // Format date function
    const formatDate = (dateValue) => {
        if (!dateValue) return language === 'FR' ? 'Non spécifié' : 'Not specified';

        let date;

        // Handle Firestore Timestamp
        if (dateValue && typeof dateValue._seconds === 'number') {
            date = new Date(dateValue._seconds * 1000);
        }
        // Handle regular timestamp (seconds)
        else if (typeof dateValue === 'number') {
            date = new Date(dateValue * 1000);
        }
        // Handle string or Date object
        else {
            date = new Date(dateValue);
        }

        if (isNaN(date.getTime())) {
            return language === 'FR' ? 'Date invalide' : 'Invalid date';
        }

        return format(date, "d MMMM yyyy 'à' HH:mm", { locale: language === 'FR' ? fr : enUS });
    };

    // Get status badge class and text
    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return {
                    class: 'status-pending',
                    text: language === 'FR'
                        ? 'En attente de vérification'
                        : 'Pending verification'
                };
            case 'approved':
                return {
                    class: 'status-approved',
                    text: language === 'FR'
                        ? 'Vérifié'
                        : 'Verified'
                };
            case 'rejected':
                return {
                    class: 'status-rejected',
                    text: language === 'FR'
                        ? 'Rejeté'
                        : 'Rejected'
                };
            default:
                return {
                    class: 'status-none',
                    text: language === 'FR'
                        ? 'Non soumis'
                        : 'Not submitted'
                };
        }
    };

    const statusBadge = getStatusBadge(user.verificationStatus);

    const hasDocuments = user.documents &&
        (user.documents.identityDocument || user.documents.selfie);


    // Approve verification
    const handleApprove = async () => {
        const userID = currentUser?.uid;
        if (!userID || !userData?.permissions.includes('MANAGE_USERS')) {
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? 'Vous n\'avez pas les permissions nécessaires pour cette action.'
                    : 'You do not have the necessary permissions for this action.'
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const idToken = await currentUser?.getIdToken();
            const result = await updateUserVerificationStatus(user?.userID, idToken, {
                verificationStatus: 'approved',
            });

            if (result.success) {
                setToast({
                    show: true,
                    type: 'success',
                    message: 'Vérification approuvée avec succès.'
                });
            } else {
                throw new Error('Échec de la mise à jour');
            }
        } catch (error) {
            console.error('Erreur lors de l\'approbation:', error);
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? 'Erreur lors de l\'approbation de la vérification.'
                    : 'Error approving verification.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reject verification
    const handleReject = async (e) => {
        e.preventDefault();

        const userID = currentUser?.uid;
        if (!userID || !userData?.permissions.includes('MANAGE_USERS')) {
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? 'Vous n\'avez pas les permissions nécessaires pour cette action.'
                    : 'You do not have the necessary permissions for this action.'
            });
            return;
        }

        if (!rejectionReason.trim()) {
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? 'Veuillez fournir un motif de rejet.'
                    : 'Please provide a rejection reason.'
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await updateUserVerificationStatus(user?.userID, {
                verificationStatus: 'rejected',
                rejectionReason: rejectionReason.trim(),
            });

            if (result.success) {
                setToast({
                    show: true,
                    type: 'success',
                    message: language === 'FR'
                        ? 'Vérification rejetée avec succès.'
                        : 'Verification rejected successfully.'
                });
                setShowRejectForm(false);
                setRejectionReason('');
            } else {
                throw new Error('Échec de la mise à jour');
            }
        } catch (error) {
            console.error('Erreur lors du rejet:', error);
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? 'Erreur lors du rejet de la vérification.'
                    : 'Error rejecting verification.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fallback for PDF rendering
    const renderDocumentPreview = (url) => {
        if (isPdfUrl(url)) {
            return (
                <div className="pdf-preview">
                    <div className="pdf-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                    </div>
                    <p>Document PDF</p>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-pdf-btn"
                    >
                        {language === 'FR' ? 'Voir le document' : 'View Document'}
                    </a>
                </div>
            );
        }
        return (
            <img
                src={url}
                alt="Pièce d'identité"
                onLoad={() => handleImageLoaded('identity')}
                onError={() => handleImageError('identity')}
                style={{ display: loading.identity ? 'none' : 'block' }}
            />
        );
    };

    return (
        <div className='tab-content'>
            <div className="tab-name">
                {language === 'FR' ? 'Vérification de documents' : 'Document Verification'}
            </div>

            <div className="verification-status">
                <span className={`status-badge ${statusBadge.class}`}>
                    {statusBadge.text}
                </span>

                {user.verificationStatus === 'rejected' && user.rejectionReason && (
                    <div className="rejection-reason">
                        <strong>{language === 'FR' ? "Motif du rejet" : "Rejection reason"} :</strong> {user.rejectionReason}
                    </div>
                )}
            </div>

            {hasDocuments ? (
                <div className="documents-container">
                    {user.documents.identityDocument && (
                        <div className="document-card">
                            <h3>{language === 'FR' ? "Pièce d'identité" : "Identity document"}</h3>
                            <div className="document-image-container">
                                {renderDocumentPreview(user.documents.identityDocument)}
                            </div>
                            <div className="document-info">
                                <p>Document soumis le {formatDate(user.updatedAt)}</p>
                            </div>
                        </div>
                    )}

                    {user.documents.selfie && (
                        <div className="document-card">
                            <h3>{language === 'FR' ? "Selfie" : "Face ID"}</h3>
                            <div className="document-image-container">
                                {loading.selfie && <div className="loading-spinner">{language === 'FR' ? "Chargement..." : "Loading..."}</div>}
                                <img
                                    src={user.documents.selfie}
                                    alt="Selfie avec pièce d'identité"
                                    onLoad={() => handleImageLoaded('selfie')}
                                    onError={() => handleImageError('selfie')}
                                    style={{ display: loading.selfie ? 'none' : 'block' }}
                                />
                            </div>
                            <div className="document-info">
                                <p>{language === 'FR' ? "Photo soumise le" : "Photo submitted on"} {formatDate(user.updatedAt)}</p>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="no-documents">
                    <p>
                        {language === 'FR'
                            ? "Aucun document de vérification n'a été soumis."
                            : "No verification documents have been submitted."
                        }
                    </p>
                </div>
            )}

            {user.verificationStatus === 'pending' && (
                <div className="admin-controls">
                    <h3>{language === 'FR' ? "Actions administrateur" : "Admin actions"}</h3>
                    <div className="admin-buttons">
                        <button
                            className="approve-btn"
                            onClick={handleApprove}
                            disabled={isSubmitting}
                        >
                            {language === 'FR' ?
                                isSubmitting ? 'Traitement...' : 'Approuver la vérification'
                                : isSubmitting ? 'Processing...' : 'Approve verification'
                            }
                        </button>
                        <button
                            className="reject-btn"
                            onClick={() => setShowRejectForm(true)}
                            disabled={isSubmitting}
                        >
                            {language === 'FR'
                                ? "Rejeter la vérification"
                                : "Reject verification"
                            }
                        </button>
                    </div>

                    {showRejectForm && (
                        <form className="reject-form" onSubmit={handleReject}>
                            <h4>{language === 'FR'
                                ? "Motif du rejet"
                                : "Rejection reason"
                            }
                            </h4>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder={language === 'FR'
                                    ? "Veuillez indiquer le motif du rejet"
                                    : "Please specify the reason for rejection"
                                }
                                rows={4}
                                required
                            />
                            <div className="form-buttons">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => {
                                        setShowRejectForm(false);
                                        setRejectionReason('');
                                    }}
                                    disabled={isSubmitting}
                                >
                                    {language === 'FR' ? "Annuler" : "Cancel"}
                                </button>
                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={isSubmitting}
                                >
                                    {language === 'FR' ?
                                        isSubmitting ? <Spinner /> : 'Confirmer le rejet'
                                        : isSubmitting ? <Spinner /> : 'Confirm rejection'
                                    }
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default function UserCard({ user }) {
    const { currentUser, userData } = useContext(AuthContext);
    const { language } = useContext(LanguageContext);
    const [activeTab, setActiveTab] = useState('info');
    const [loginActivity, setLoginActivity] = useState([]);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const tabsContainerRef = useRef(null);
    const [hasOverflow, setHasOverflow] = useState(false);

    useEffect(() => {
        // if (!user_id) return;

        const fetchUserActivity = async () => {
            const result = await getUserIDLoginActivity(user?.UserID);
            if (result.success) {
                setLoginActivity(result.activity);
            }
        };

        fetchUserActivity();
    }, [user]);

    useEffect(() => {
        const checkOverflow = () => {
            if (tabsContainerRef.current) {
                const { scrollWidth, clientWidth } = tabsContainerRef.current;
                setHasOverflow(scrollWidth > clientWidth);
            }
        };

        // Check on initial render
        checkOverflow();

        // Check on window resize
        window.addEventListener('resize', checkOverflow);

        return () => {
            window.removeEventListener('resize', checkOverflow);
        };
    }, []);

    // Determine if there's a pending verification
    const hasPendingVerification = user &&
        user?.verificationStatus === "pending";

    const tabs = [
        { name: 'info', label: language === 'FR' ? 'Infos Perso.' : 'Perso. Infos', icon: UserCircle, action: () => { } },
        { name: 'transaction', label: language === 'FR' ? 'Transactions' : 'Transactions', icon: CreditCard, action: () => { } },
        { name: 'document', label: language === 'FR' ? 'Documents' : 'Documents', icon: Files, badge: hasPendingVerification ? "pending" : null, action: () => { } },
        { name: 'activity', label: language === 'FR' ? 'Activités' : 'Acitivities', icon: Activity, action: () => { } },
    ];

    const formatDateTimestamp = (adTimestamp, language = 'FR') => {
        if (!adTimestamp) return language === 'FR' ? "Date inconnue" : "Unknown date";

        const adDate = new Date(adTimestamp?._seconds * 1000);
        const now = new Date();
        const diffDays = differenceInDays(now, adDate);

        if (language === 'FR') {
            if (diffDays === 0) return `Auj. à ${format(adDate, 'HH:mm', { locale: fr })}`;
            if (diffDays === 1) return `Hier à ${format(adDate, 'HH:mm', { locale: fr })}`;
            if (diffDays === 2) return `Avant-hier à ${format(adDate, 'HH:mm', { locale: fr })}`;
            return `${format(adDate, 'dd/MM/yyyy à HH:mm', { locale: fr })}`;
        } else {
            // English formatting
            if (diffDays === 0) return `Today at ${format(adDate, 'h:mm a', { locale: enUS })}`;
            if (diffDays === 1) return `Yesterday at ${format(adDate, 'h:mm a', { locale: enUS })}`;
            if (diffDays === 2) return `2 days ago at ${format(adDate, 'h:mm a', { locale: enUS })}`;
            return `${format(adDate, 'MM/dd/yyyy at h:mm a', { locale: enUS })}`;
        }
    };



    const renderTabContent = () => {
        switch (activeTab) {
            case 'info':
                return <PersonalInformation userData={user} language={language} />
            case 'transaction':
                return (
                    <div className='tab-content'>
                        <div className="tab-name">
                            {language === 'FR' ? "Aucune transaction" : "No transaction"}
                        </div>
                    </div>
                );
            case 'document':
                return <DocumentVerification
                    user={user}
                    userData={userData}
                    currentUser={currentUser}
                    setToast={setToast}
                    language={language}
                />;
            case 'activity':
                return (
                    <div className='tab-content'>
                        <div className="tab-name">
                            {language === 'FR' ? 'Activité de Connexion' : 'Login Activity'}
                        </div>
                        <p>
                            {loginActivity.length === 0
                                ? (language === 'FR'
                                    ? "Aucune activité récente."
                                    : "No recent activity.")
                                : (language === 'FR'
                                    ? `Voici votre journal ${loginActivity.length > 1
                                        ? `des ${loginActivity.length} dernières activités`
                                        : "de dernière activité"
                                    } de connexion.`
                                    : `Here is your ${loginActivity.length > 1
                                        ? `last ${loginActivity.length} login activities`
                                        : "last login activity"
                                    } log.`
                                )
                            }
                        </p>

                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{language === 'FR' ? 'Navigateur' : 'Browser'}</th>
                                        <th>{language === 'FR' ? 'Système' : 'System'}</th>
                                        <th>{language === 'FR' ? 'Adresse IP' : 'IP Address'}</th>
                                        <th>{language === 'FR' ? 'Période' : 'Time'}</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {loginActivity.map((activity, index) => (
                                        <tr key={index}>
                                            <td>{activity.deviceInfo.browser}</td>
                                            <td>{activity.deviceInfo.os}</td>
                                            <td>{activity.deviceInfo.ip}</td>
                                            <td>{formatDateTimestamp(activity.time)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="user-card">
            <div
                ref={tabsContainerRef}
                className={`tabs-container ${hasOverflow ? 'has-overflow' : ''}`}
            >
                <div className="tabs-header">
                    {tabs.map(tab => (
                        <button
                            key={tab.name}
                            className={`tab-button ${activeTab === tab.name ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.name)}
                        >
                            <tab.icon size={16} />
                            <span>{tab.label}</span>
                            <div className="tab-icon-container">
                                {tab.badge && (
                                    <span className={`tab-badge ${tab.badge}`}>
                                        {tab.badge === "pending" ? "!" : ""}
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>


            <div className="tab-body">
                {renderTabContent()}
            </div>

            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
};
