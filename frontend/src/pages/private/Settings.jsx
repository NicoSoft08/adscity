import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Toast from '../../customs/Toast';
import { useNavigate } from 'react-router-dom';
import {
    requestPasswordReset,
} from '../../routes/authRoutes';
import Spinner from '../../customs/Spinner';
import Modal from '../../customs/Modal';
import { facebook, instagram, whatsapp } from '../../config/images';
import { updateSocialLinks } from '../../routes/apiRoutes';
import '../../styles/Settings.scss';

export default function Settings() {
    const { currentUser, userData, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [socialInfo, setSocialInfo] = useState({
        facebook: "",
        whatsapp: "",
        instagram: "",
    });
    const [securityInfo, setSecurityInfo] = useState({
        email: userData?.email || "",
        newEmail: "",
        verificationCode: "",
        password: "",
    });



    const handleSocialInputChange = (e) => {
        const { name, value } = e.target;
        setSocialInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const handleSecurityInfoUpdate = async () => {
        const newPassword = securityInfo.password;

        if (!newPassword) {
            setToast({
                show: true,
                message: "Veuillez renseigner votre nouveau mot de passe !",
                type: 'error',
            });
            return;
        }

        const result = await requestPasswordReset(userData.email, newPassword);
        if (result.error) {
            setToast({
                show: true,
                message: result.message,
                type: 'error',
            });
        } else {
            setToast({
                show: true,
                message: result.message,
                type: 'success',
            });
        }
    }

    const handleOpen = () => setOpen(true);

    const handleLogout = async () => {
        setIsLoading(true);

        try {
            const response = await logout();

            setToast({
                show: true,
                message: response.message,
                type: response.success ? 'success' : 'error',
            });

            if (response.success) {
                navigate('/');
                setOpen(false);
            }
        } catch (error) {
            setToast({
                show: true,
                message: "Erreur lors de la déconnexion. Veuillez réessayer.",
                type: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAccountDeletion = async () => {
        setShowModal(true); // Ouvre le Modal
    }

    const closeModal = () => {
        setShowModal(false); // Ferme le Modal
    };

    const handleSocialInfoUpdate = async () => {
        // Vérifier si au moins un champ est rempli
        const hasAtLeastOneValue = Object.values(socialInfo).some(value => value.trim() !== "");

        if (!hasAtLeastOneValue) {
            setToast({
                type: 'error',
                show: true,
                message: "Veuillez entrer au moins un réseau social avant d'enregistrer.",
            });
            return;
        }

        const result = await updateSocialLinks(currentUser?.uid, socialInfo);

        if (result.success) {
            setToast({
                type: 'info',
                show: true,
                message: result.message,
            });
        } else {
            setToast({
                type: 'error',
                show: true,
                message: result.message,
            });
        };
    };

    return (
        <div className='user-settings'>
            <h2>Paramètres</h2>

            {/* PERSONNALISATION POUR LES COMPTES  ENTREPRISES ET PROFESSIONNELS */}
            {currentUser && (userData.profileType === 'Professionnel' || userData.profileType === 'Entreprise') && (
                <section className="social-network">
                    <h2>Réseaux sociaux</h2>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className='social-network-form'>
                            <img src={facebook} alt="faceook" />
                            <input
                                name='facebook'
                                value={socialInfo.facebook}
                                onChange={handleSocialInputChange}
                                placeholder="Facebook"
                            />
                        </div>
                        <div className='social-network-form'>
                            <img src={instagram} alt="instagram" />
                            <input
                                name='instagram'
                                value={socialInfo.instagram}
                                onChange={handleSocialInputChange}
                                placeholder="Instagram"
                            />
                        </div>
                        <div className='social-network-form'>
                            <img src={whatsapp} alt="whatsapp" />
                            <input
                                name='whatsapp'
                                value={socialInfo.whatsapp}
                                onChange={handleSocialInputChange}
                                placeholder="Whatsapp"
                            />
                        </div>

                        <button onClick={handleSocialInfoUpdate}>Enregistrer</button>
                    </form>
                </section>
            )}

            <section className="security-info">
                <h2>Sécurité</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    <input
                        type="password"
                        value={securityInfo.password}
                        onChange={(e) =>
                            setSecurityInfo({
                                ...securityInfo,
                                password: e.target.value
                            })
                        }
                        placeholder="Nouveau mot de passe"
                    />
                    <button onClick={handleSecurityInfoUpdate}>
                        {isLoading ? <Spinner /> : "Enregistrer"}
                    </button>
                </form>
            </section>

            <section className="help-zone">
                <h2>Assistance</h2>
                <button onClick={() => navigate('/contact-us')} className='help-button'>Support Client</button>
                <button onClick={() => navigate('/help-center/faq')} className='help-button'>FAQs</button>
            </section>

            <section className="danger-zone">
                <h2>Zone Danger</h2>
                <button className="logout" onClick={handleOpen}>Déconnexion</button>
                <button onClick={handleAccountDeletion} className="delete-button">
                    Supprimer le compte
                </button>
            </section>

            {open &&
                <Modal
                    title={"Déconnexion"}
                    onShow={() => setOpen(true)}
                    onHide={() => setOpen(false)}
                    onNext={handleLogout}
                    isNext={true}
                    isHide={false}
                    nextText={isLoading ? <Spinner /> : "Oui"}
                    hideText={"Annuler"}
                >
                    <p>Confirmez-vous vouloir vous déconnecter ?</p>
                </Modal>
            }

            {showModal && (
                <Modal
                    title={"Supprimer mon compte"}
                    onShow={() => setShowModal(true)}
                    onHide={closeModal}
                    isNext={false}

                >
                    <p>
                        Pour des raisons de sécurité, veuillez contacter notre support client
                        à <strong>support@adscity.net</strong> pour effectuer cette action.
                    </p>
                </Modal>
            )}

            <Toast type={toast.type} message={toast.message} show={toast.show} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
};
