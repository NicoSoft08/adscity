import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Modal from '../../customs/Modal';
import Toast from '../../customs/Toast';
import Spinner from '../../customs/Spinner';
import { updateUserFields } from '../../routes/userRoutes';
import { useNavigate } from 'react-router-dom';
import {
    logoutUser,
    sendVerificationCode,
    updateUserPassword,
    verifyCodeAndUpdateEmail
} from '../../routes/authRoutes';
import '../../styles/Settings.scss';

export default function Settings() {
    const { currentUser, userData } = useContext(AuthContext);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [personalInfo, setPersonalInfo] = useState({
        firstName: userData?.firstName || "",
        lastName: userData?.lastName || "",
        phoneNumber: userData?.phoneNumber || "",
        country: userData?.country || "",
        city: userData?.city || "",
        address: userData?.address || "",
    });
    const [securityInfo, setSecurityInfo] = useState({
        email: userData?.email || "",
        newEmail: "",
        verificationCode: "",
        password: "",
    });
    const [step, setStep] = useState("form"); // "form" | "verification"
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPersonalInfo({ ...personalInfo, [name]: value });
    };

    const handlePersonalInfoUpdate = async () => {
        const userID = currentUser?.uid;
        setIsLoading(true);

        // Détecter les champs modifiés
        const updatedFields = {};
        for (const key in personalInfo) {
            if (personalInfo[key] !== userData[key]) {
                updatedFields[key] = personalInfo[key];
            }
        }

        if (Object.keys(updatedFields).length === 0) {
            setToast({
                show: true,
                message: "Aucun champ n'a été modifié.",
                type: 'error',
            });
            return;
        }

        const result = await updateUserFields(userID, updatedFields);
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
            setPersonalInfo({
                firstName: userData?.firstName || "",
                lastName: userData?.lastName || "",
                phoneNumber: userData?.phoneNumber || "",
                country: userData?.country || "",
                city: userData?.city || "",
                address: userData?.address || "",
            });
        }
    }


    const handleSecurityInfoUpdate = async () => {
        const userID = currentUser?.uid;
        const password = securityInfo.password;

        if (!password) {
            setToast({
                show: true,
                message: "Veuillez renseigner votre nouveau mot de passe !",
                type: 'error',
            });
            return;
        }

        const result = await updateUserPassword(userID, password);
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


    const handleSendVerificationCode = async () => {
        const userID = currentUser?.uid;
        const newEmail = securityInfo.newEmail;

        if (!newEmail) {
            setToast({
                show: true,
                message: "Veuillez renseigner votre nouvel email !",
                type: 'error',
            });
            return;
        }

        if (newEmail === userData?.email) {
            setToast({
                show: true,
                message: "L'email actuel et le nouvel email sont identiques !",
                type: 'error',
            });
            setTimeout(() => { setSecurityInfo({ newEmail: '' }) }, 2000);
            return;
        }

        setIsLoading(true);

        const result = await sendVerificationCode(userID, newEmail);
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
            setStep("verification");
        }
    }

    const handleVerifyCodeAndUpdateEmail = async () => {
        const userID = currentUser?.uid;
        const email = securityInfo.email;
        const verificationCode = securityInfo.verificationCode;

        const result = await verifyCodeAndUpdateEmail(userID, email, verificationCode);
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
            setStep("form");
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

            <section className="personal-info">
                <h2>Informations personnelles</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    <input
                        type="text"
                        name='firstName'
                        value={personalInfo.firstName}
                        onChange={handleInputChange}
                        placeholder="Prénom"
                    />
                    <input
                        type="text"
                        name='lastName'
                        value={personalInfo.lastName}
                        onChange={handleInputChange}
                        placeholder="Nom"
                    />
                    <input
                        type="tel"
                        name='phoneNumber'
                        value={personalInfo.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Téléphone"
                    />
                    <input
                        type="text"
                        name='country'
                        value={personalInfo.country}
                        onChange={handleInputChange}
                        placeholder="Pays"
                    />
                    <input
                        type="text"
                        name='city'
                        value={personalInfo.city}
                        onChange={handleInputChange}
                        placeholder="Ville"
                    />
                    <input
                        type="text"
                        name='address'
                        value={personalInfo.address}
                        onChange={handleInputChange}
                        placeholder="Adresse"
                    />
                    <button onClick={handlePersonalInfoUpdate}>Enregistrer</button>
                </form>
            </section>

            <section className="security-info">
                <h2>Sécurité</h2>
                {step === "form" && (
                    <form onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="email"
                            value={securityInfo.newEmail}
                            onChange={(e) =>
                                setSecurityInfo({ ...securityInfo, newEmail: e.target.value })
                            }
                            placeholder="Nouvel email"
                        />
                        <button onClick={handleSendVerificationCode}>
                            {isLoading ? <Spinner /> : "Envoyer un code"}
                        </button>
                    </form>
                )}

                {step === "verification" && (
                    <form onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="text"
                            value={securityInfo.verificationCode}
                            onChange={(e) =>
                                setSecurityInfo({ ...securityInfo, verificationCode: e.target.value })
                            }
                            placeholder="Code de vérification"
                        />
                        <button onClick={handleVerifyCodeAndUpdateEmail}>
                            {isLoading ? <Spinner /> : "Vérifier et Mettre à jour"}
                        </button>
                    </form>
                )}

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

            <section className="danger-zone">
                <h2>Zone Danger</h2>
                <button className="logout" onClick={handleOpen}>Déconnexion</button>
                <button onClick={handleAccountDeletion} className="delete-button">
                    Supprimer le compte
                </button>
            </section>

            {/* <div className="settings-section">
                <h3>Connectivité</h3>
                <button>Connexions Tierces</button>
                <button>Appareils Connectés</button>
            </div> */}

            <Toast type={toast.type} message={toast.message} show={toast.show} onClose={() => setToast({ ...toast, show: false })} />

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
        </div>
    );
};
