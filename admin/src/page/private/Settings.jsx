import React, { useState } from 'react';
import Toast from '../../customs/Toast';
import { useNavigate } from 'react-router-dom';
import {
    logoutUser,
    updateUserPassword,
} from '../../routes/authRoutes';
import Spinner from '../../customs/Spinner';
import Modal from '../../customs/Modal';
import '../../styles/Settings.scss';

export default function Settings({ userData }) {
    const navigate = useNavigate();
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [securityInfo, setSecurityInfo] = useState({
        email: userData?.email || "",
        newEmail: "",
        verificationCode: "",
        password: "",
    });


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

        const result = await updateUserPassword(userData.email, newPassword);
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

        const response = await logoutUser();

        setIsLoading(false);

        if (response.success) {
            setToast({
                show: true,
                message: response.message,
                type: 'success',
            });

            navigate('/');  // 🔹 Redirection vers la page d'accueil après la déconnexion
            setOpen(false);

        } else {
            setToast({
                show: true,
                message: response.message,
                type: 'error',
            });
        }
    };

    const handleAccountDeletion = async () => {
        setShowModal(true); // Ouvre le Modal
    }

    const closeModal = () => {
        setShowModal(false); // Ferme le Modal
    };

    return (
        <div className='user-settings'>
            <h2>Paramètres</h2>

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
