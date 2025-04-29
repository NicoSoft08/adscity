import React, { useContext, useState } from 'react';
import Toast from '../../customs/Toast';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../customs/Spinner';
import Modal from '../../customs/Modal';
import { AuthContext } from '../../contexts/AuthContext';
import { LanguageContext } from '../../contexts/LanguageContext';
import { translations } from '../../langs/translations';
import '../../styles/Settings.scss';

export default function Settings() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const { language, setLanguage } = useContext(LanguageContext);
    const t = translations[language] || translations.FR;



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
                message: language === 'FR'
                    ? "Erreur lors de la déconnexion. Veuillez réessayer."
                    : "Error during logout. Please try again.",
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

    // Composant de toggle de langue
    const LanguageToggle = () => {
        const toggleLanguage = () => {
            setLanguage(language === 'FR' ? 'EN' : 'FR');
            // translate();
        };

        return (
            <div className="language-toggle">
                <span className={language === 'FR' ? 'active' : ''}>FR</span>
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={language === 'EN'}
                        onChange={toggleLanguage}
                    />
                    <span className="slider round"></span>
                </label>
                <span className={language === 'EN' ? 'active' : ''}>EN</span>
            </div>
        );
    };

    return (
        <div className='user-settings'>
            {/* <h2>Paramètres</h2> */}
            <h2>{t.settings}</h2>

            {/* <section className="security-info">
                <h2>{t.security}</h2>
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
                        placeholder={t.newPassword}
                    />
                    <button onClick={handleSecurityInfoUpdate}>
                        {isLoading ? <Spinner /> : t.save}
                    </button>
                </form>
            </section> */}

            <section className="preference-zone">
                <h2>{t.preference}</h2>
                <div className="preference-item">
                    <span>{t.language}</span>
                    <LanguageToggle />
                </div>
            </section>

            <section className="help-zone">
                <h2>{t.support}</h2>
                <button onClick={() => navigate('/contact-us')} className='help-button'>{t.supp_client}</button>
                <button onClick={() => navigate('/help-center/faq')} className='help-button'>FAQs</button>
            </section>

            <section className="danger-zone">
                <h2>{t.danger_zone}</h2>
                <button className="logout" onClick={handleOpen}>{t.logout}</button>
                <button onClick={handleAccountDeletion} className="delete-button">
                    {t.delete_account}
                </button>
            </section>

            {open &&
                <Modal
                    title={t.logout}
                    onShow={() => setOpen(true)}
                    onHide={() => setOpen(false)}
                    onNext={handleLogout}
                    isNext={true}
                    isHide={false}
                    nextText={isLoading ? <Spinner /> : t.yes}
                    hideText={t.cancel}
                >
                    <p>{t.logout_confirm}</p>
                </Modal>
            }

            {showModal && (
                <Modal
                    title={t.delete_title}
                    onShow={() => setShowModal(true)}
                    onHide={closeModal}
                    isNext={false}

                >
                    <p>{t.delete_alert}</p>
                </Modal>
            )}

            <Toast type={toast.type} message={toast.message} show={toast.show} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
};
