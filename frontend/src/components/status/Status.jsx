import React, { useContext, useEffect, useState } from 'react';
import StatusItem from '../../utils/StatusItem';
import { AuthContext } from '../../contexts/AuthContext';
import { LanguageContext } from '../../contexts/LanguageContext';
import { getStatusByUserID } from '../../routes/statusRoutes';
import StatusViewer from '../../utils/StatusViewer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './Status.scss';

export default function Status() {
    const navigate = useNavigate();
    const { currentUser, userData } = useContext(AuthContext);
    const { language } = useContext(LanguageContext);
    const [statuses, setStatuses] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);

    useEffect(() => {
        const fetchStatuses = async () => {
            const userID = currentUser.uid;
            const idToken = await currentUser.getIdToken();
            try {
                const response = await getStatusByUserID(userID, idToken);
                if (response.success) {
                    setStatuses(response.data);
                }
            } catch (error) {
                console.error('Erreur pendant la collecte des données: ', error);
            }
        }

        fetchStatuses();
    }, [currentUser]);

    const markStatusAsViewed = async () => { }

    const handleStatusClick = (status) => {
        setSelectedStatus(status);
    };

    return (
        <div className='status'>
            <div className="head">
                <h2>{language === 'FR' ? "Gestion des Statuts" : "Statuses Management"} {statuses.length}</h2>
                <button className='add-new-ad' onClick={() => navigate('/user/dashboard/status/new')}>
                    <FontAwesomeIcon icon={faPlusSquare} className='icon' />
                    <span>Créer un statut</span>
                </button>
            </div>

            {statuses.length === 0 ? (
                <div className="no-status-message">
                    {currentUser.uid === userData.userID
                        ? "Vous n'avez pas encore publié de statut. Créez votre premier statut !"
                        : "Cet utilisateur n'a pas encore publié de statut."}
                </div>
            ) : (
                <div className='status-wrap'>
                    {statuses.map((item) => (
                        <StatusItem
                            key={item.statusID}
                            status={item}
                            user={{
                                firstName: userData?.firstName,
                                lastName: userData?.lastName,
                                profilURL: userData?.profilURL
                            }}
                            onClick={handleStatusClick}
                            isCurrentUser={item.userID === currentUser?.uid}
                            hasViewed={false} // Logique à implémenter pour vérifier si le statut a été vu
                        />
                    ))}
                </div>
            )}

            {selectedStatus && (
                <StatusViewer
                    statuses={statuses}
                    initialStatusId={selectedStatus.statusID}
                    onClose={() => setSelectedStatus(null)}
                    currentUserID={currentUser?.uid}
                    markStatusAsViewed={markStatusAsViewed}
                />
            )}
        </div>
    );
};
