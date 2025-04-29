import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import data from '../../json/data.json';
import sensitive_cats from '../../json/sensitiveCategories.json';
import formFields from "../../json/formFields.json";
import Modal from '../../customs/Modal';
import Spinner from '../../customs/Spinner';
import { uploadSensitiveVerification } from '../../routes/storageRoutes';
import Toast from '../../customs/Toast';
import { CheckCircle } from 'lucide-react';
import { LanguageContext } from '../../contexts/LanguageContext';
import './SelectCategory.scss';

export default function SelectCategory({ onNext, formData, setFormData, currentUser, userData }) {
    const { language } = useContext(LanguageContext);
    const [document, setDocument] = useState(null);
    const [faceImage, setFaceImage] = useState(null);
    const [activeTab, setActiveTab] = useState('document');
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [verificationStatus, setVerificationStatus] = useState('pending'); // pending, success, failed

    // Récupérer la liste des sous-catégories selon la catégorie sélectionnée
    const subcategories = useMemo(() => {
        const categoryData = data.categories.find(cat => cat.categoryName === formData.category);
        return categoryData ? categoryData.container || [] : [];
    }, [formData.category]);

    // Vérifie si la catégorie sélectionnée est sensible
    const isCatSensitive = useMemo(() => {
        return sensitive_cats.sensitive_cats.some(cat => cat.categoryName === formData.category);
    }, [formData.category]);

    // Met à jour les champs dynamiques en fonction de la sous-catégorie
    useEffect(() => {
        if (formData.subcategory) {
            const fields = formFields.fields[formData.subcategory] || [];
            const initialData = fields.reduce((acc, field) => {
                acc[field.name] = field.type === "checkbox" || field.type === "file" ? [] : "";
                return acc;
            }, {});
            setFormData(prev => ({ ...prev, details: initialData }));
        }
    }, [formData.subcategory, setFormData]);

    // Gestion des changements de catégorie
    const handleChangeCategory = useCallback((e) => {
        const newCategory = e.target.value;
        setFormData(prev => ({ ...prev, category: newCategory, subcategory: '' }));
    }, [setFormData]);

    // Gestion des changements de sous-catégorie
    const handleChangeSubcategory = useCallback((e) => {
        setFormData(prev => ({ ...prev, subcategory: e.target.value }));
    }, [setFormData]);

    // Validate a single file
    const validateFile = useCallback((file) => {
        // Security: Validate file type
        const allowedDocTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        const allowedSelfieTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const maxSize = 10 * 1024 * 1024; // 10MB - reduced for security

        if (!file) {
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? 'Aucun fichier sélectionné.'
                    : 'No file selected.'
            });
            return false;
        }

        // Check file type based on context
        const isDocument = activeTab === 'document';
        const allowedTypes = isDocument ? allowedDocTypes : allowedSelfieTypes;

        if (!allowedTypes.includes(file.type)) {
            setToast({
                type: 'error',
                message: isDocument
                    ? 'Format non autorisé. Seuls les fichiers JPG, PNG, JPEG ou PDF sont acceptés pour les documents.'
                    : 'Format non autorisé. Seuls les fichiers JPG, PNG ou JPEG sont acceptés pour les selfies.'
            });
            return false;
        }

        if (file.size > maxSize) {
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? 'Le fichier dépasse la taille maximale de 5MB.'
                    : 'File exceeds maximum size of 5MB.'
            });
            return false;
        }

        return true;
    }, [activeTab, setToast, language]);

    // Reset modal state
    const closeModal = useCallback(() => {
        setOpenModal(false);
        setLoading(false);
        setDocument(null);
        setFaceImage(null);
        setActiveTab('document');
        setVerificationStatus('pending');
    }, []);

    // Handle document file upload
    const handleFileUpload = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            if (validateFile(file)) {
                setDocument(file);
            } else {
                e.target.value = null; // Reset input
            }
        }
    }, [validateFile]);

    // Handle selfie image upload
    const handleFaceImageUpload = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            if (validateFile(file)) {
                setFaceImage(file);
            } else {
                e.target.value = null; // Reset input
            }
        }
    }, [validateFile]);


    // Gestion de l'upload de documents
    const handleVerify = async () => {
        const userID = currentUser?.uid;
        if (!userID) {
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? 'Vous devez être connecté pour effectuer cette action.'
                    : 'You must be logged in to perform this action.'
            });
            return;
        }

        if (!document) {
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? 'Veuillez télécharger une pièce d\'identité.'
                    : 'Please upload an identity document.'
            });
            setActiveTab('document');
            return;
        }

        if (!faceImage) {
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? 'Veuillez télécharger un selfie.'
                    : 'Please upload a selfie.'
            });
            setActiveTab('face');
            return;
        }

        // Revalidate files before submission
        if (!validateFile(document) || !validateFile(faceImage)) {
            return;
        }

        try {
            setLoading(true);
            const idToken = await currentUser.getIdToken();

            const result = await uploadSensitiveVerification(userID, document, faceImage, idToken);

            if (result.success) {
                setVerificationStatus('success');
                setToast({
                    show: true,
                    type: 'success',
                    message: language === 'FR'
                        ? 'Vérification soumise avec succès. Vous serez notifié une fois traitée.'
                        : 'Verification submitted successfully. You will be notified once processed.'
                });
            } else {
                setVerificationStatus('failed');

                // Handle specific error codes
                let errorMessage = result.message || 'Échec de la vérification. Veuillez réessayer.';

                switch (result.errorCode) {
                    case 'INVALID_FILE_TYPE':
                        errorMessage = language === 'FR'
                            ? 'Format de fichier non autorisé. Veuillez vérifier les formats acceptés.'
                            : 'Invalid file type. Please check accepted formats.';
                        setToast({ show: true, type: 'error', message: errorMessage });
                        setActiveTab(errorMessage.includes('selfie') ? 'face' : 'document');
                        break;

                    case 'VERIFICATION_ALREADY_PENDING':
                        errorMessage = language === 'FR'
                            ? 'Vous avez déjà une demande de vérification en cours.'
                            : 'You already have a pending verification request.';
                        setToast({ show: true, type: 'error', message: errorMessage });
                        break;

                    case 'STORAGE_QUOTA_EXCEEDED':
                        errorMessage = language === 'FR'
                            ? 'Service temporairement indisponible. Veuillez réessayer plus tard.'
                            : 'Service temporarily unavailable. Please try again later.';
                        setToast({ show: true, type: 'error', message: errorMessage });
                        break;

                    case 'MISSING_DOCUMENT':
                        errorMessage = language === 'FR'
                            ? 'Veuillez télécharger une pièce d\'identité.'
                            : 'Please upload an identity document.';
                        setToast({ show: true, type: 'error', message: errorMessage });
                        setActiveTab('document');
                        break;

                    case 'MISSING_SELFIE':
                        errorMessage = language === 'FR'
                            ? 'Veuillez télécharger un selfie.'
                            : 'Please upload a selfie.';
                        setToast({ show: true, type: 'error', message: errorMessage });
                        setActiveTab('face');
                        break;
                    default:
                        break;
                }

                setToast({
                    show: true,
                    type: 'error',
                    message: errorMessage
                });
                setLoading(false);
            }
        } catch (error) {
            console.error('Erreur lors de la vérification:', error);
            setVerificationStatus('failed');
            setToast({
                show: true,
                type: 'error',
                message: language === 'FR'
                    ? 'Une erreur est survenue. Veuillez réessayer plus tard.'
                    : 'An error occurred. Please try again later.'
            });
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    // Render file preview
    const renderFilePreview = useCallback((file) => {
        if (!file) return null;

        if (file.type === "application/pdf") {
            return (
                <div className="pdf-preview">
                    <embed
                        src={URL.createObjectURL(file)}
                        type="application/pdf"
                        width="100%"
                        height="300px"
                    />
                    <p className="file-info">
                        {file.name} (PDF - {(file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                </div>
            );
        } else {
            return (
                <div className="image-preview">
                    <img
                        src={URL.createObjectURL(file)}
                        alt={activeTab === 'document' ? "Document" : "Selfie"}
                        style={{ maxWidth: '100%', maxHeight: '300px' }}
                    />
                    <p className="file-info">
                        {file.name} (Image - {(file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                </div>
            );
        }
    }, [activeTab]);

    return (
        <div className='select-cat'>
            {/* Sélection de la catégorie */}
            <select className="input-field" value={formData.category} onChange={handleChangeCategory}>
                <option value="">-- {language === 'FR'
                    ? "Sélectionner une catégorie" : "Select a category"
                } --</option>
                {data.categories.map(({ key, categoryName, categoryTitles }) => (
                    <option key={key} value={categoryName}>
                        {language === 'FR' ? categoryTitles.fr : categoryTitles.en}
                    </option>
                ))}
            </select>

            {/* Si une catégorie est sélectionnée */}
            {formData.category && (
                isCatSensitive && userData?.verificationStatus !== 'approved' ? (
                    <div className="sensitive-warning">
                        <p>🔒 <strong>{language === 'FR'
                            ? "Vérification requise pour cette catégorie"
                            : "Verification required for this category"
                        }</strong></p>
                        <p>
                            {language === 'FR'
                                ? "Pour garantir la sécurité et la qualité des annonces, une vérification supplémentaire est requise."
                                : "To guarantee the safety and quality of the ads, additional verification is required."
                            }
                            <a href="/help/posts">{language === 'FR' ? "En savoir plus" : "Learn more"}</a>
                        </p>
                        {/* <p>ℹ️ {language === 'FR'
                            ? "Ce système est en cours de mise en place. Merci de votre patience."
                            : "This system is being implemented. Thank you for your patience."
                        }</p> */}
                        <button onClick={() => setOpenModal(true)}>
                            Démarrer
                        </button>
                    </div>
                ) : (
                    <select
                        className="input-field"
                        value={formData.subcategory}
                        onChange={handleChangeSubcategory}
                    >
                        <option value="">-- {language === 'FR' ? "Sélectionner une sous-catégorie" : "Select a subcategory"} --</option>
                        {subcategories.map(({ sousCategoryName, sousCategoryTitles }) => (
                            <option key={sousCategoryName} value={sousCategoryName}>
                                {language === 'FR' ? sousCategoryTitles.fr : sousCategoryTitles.en}
                            </option>
                        ))}
                    </select>
                )
            )}

            {/* Contact support */}
            <div className="contact-support">
                <p>{language === 'FR' ? "Vous ne trouvez pas la catégorie ?" : "Can't find the category?"} <Link to='/contact-us'>{language === 'FR' ? "Contactez le support" : "Contact support"}</Link></p>
            </div>

            {/* Bouton Suivant */}
            {formData.subcategory && (
                <button className='next' onClick={onNext} disabled={isCatSensitive}>
                    {language === 'FR' ? "Suivant" : "Next"}
                </button>
            )}

            {/* Modal de vérification */}
            {openModal && (
                <Modal onShow={openModal} onHide={closeModal} title="Vérification requise">
                    <div className="verification-box">
                        {verificationStatus === 'success' ? (
                            <div className="verification-success">
                                <CheckCircle size={50} className="success-icon" />
                                <h3>{language === 'FR'
                                    ? "Vérification soumise avec succès"
                                    : "Verification successfully submitted"
                                }
                                </h3>
                                <p>{language === 'FR'
                                    ? "Nous traiterons votre demande dans les plus brefs délais."
                                    : "We will process your request as soon as possible."
                                }</p>
                            </div>
                        ) : (
                            <>
                                {/* Instructions */}
                                <div className="verification-instructions">
                                    <p>{language === 'FR'
                                        ? "Pour vérifier votre identité, nous avons besoin de"
                                        : "To verify your identity, we need"
                                    } :</p>
                                    <ol>
                                        <li>{language === 'FR'
                                            ? "Une pièce d'identité officielle (carte d'identité, passeport, permis)"
                                            : "An official identity document (identity card, passport, license)"
                                        }</li>
                                        <li>{language === 'FR'
                                            ? "Un selfie montrant clairement votre visage"
                                            : "A selfie clearly showing your face"
                                        }</li>
                                    </ol>
                                    <p className="security-note">
                                        <strong>🔒 {language === 'FR' ? "Sécurité" : "Security"} :</strong> {language === 'FR'
                                            ? "Vos documents sont transmis de manière sécurisée et ne seront utilisés que pour la vérification."
                                            : "Your documents are transmitted securely and will only be used for verification."
                                        }
                                    </p>
                                </div>

                                {/* Onglets */}
                                <div className="tabs">
                                    <button className={activeTab === 'document' ? 'active' : ''} onClick={() => setActiveTab('document')}>
                                        Pièce d'identité
                                    </button>
                                    <button className={activeTab === 'face' ? 'active' : ''} onClick={() => setActiveTab('face')}>
                                        Selfie / Visage
                                    </button>
                                </div>
                                {/* Contenu onglet : Document */}
                                {activeTab === 'document' && (
                                    <div className="tab-content">
                                        <label className="upload-box">
                                            <input type="file" accept="image/*,.pdf" hidden onChange={handleFileUpload} disabled={loading} />
                                            <span>{document ? 'Changer la pièce' : 'Télécharger une pièce'}</span>
                                        </label>
                                        {document && (
                                            <div className="preview">
                                                {renderFilePreview(document)}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Contenu onglet : Face */}
                                {activeTab === 'face' && (
                                    <div className="tab-content">
                                        <label className="upload-box">
                                            <input type="file" accept="image/*" hidden onChange={handleFaceImageUpload} disabled={loading} />
                                            <span>
                                                {language === 'FR'
                                                    ? faceImage ? 'Changer la photo' : 'Télécharger un selfie'
                                                    : faceImage ? 'Change photo' : 'Upload a selfie'
                                                }
                                            </span>
                                        </label>
                                        {faceImage && (
                                            <div className="preview">
                                                {renderFilePreview(faceImage)}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Lancer vérification */}
                                <div className="verify-action">
                                    <button
                                        onClick={handleVerify}
                                        disabled={!document || !faceImage || loading}
                                    >
                                        {language === 'FR'
                                            ? loading ? <Spinner /> : "Lancer la vérification"
                                            : loading ? <Spinner /> : "Start verification"
                                        }
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </Modal>
            )}

            <Toast show={toast.show} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
};
