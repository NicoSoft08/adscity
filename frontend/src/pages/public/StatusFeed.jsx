import React, { useContext, useEffect, useRef, useState } from 'react';
import StatusItem from '../../utils/StatusItem';
import { getAllStatuses } from '../../routes/statusRoutes';
import { AuthContext } from '../../contexts/AuthContext';
import StatusViewer from '../../utils/StatusViewer';
import { fetchUserData } from '../../routes/userRoutes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import '../../styles/StatusFeed.scss';
import Loading from '../../customs/Loading';

export default function StatusFeed() {
    const { currentUser } = useContext(AuthContext);
    const [statusesWithUsers, setStatusesWithUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await getAllStatuses();
                if (response.success) {
                    // Récupérer les données utilisateur pour chaque statut
                    const statusesWithUserData = await Promise.all(
                        response.statuses.map(async (status) => {
                            try {
                                const userData = await fetchUserData(status?.userID);
                                // Combiner le statut avec les données utilisateur
                                return {
                                    ...status,
                                    userData: userData.data
                                };
                            } catch (error) {
                                console.error(`Error fetching user data for status ${status.statusID}:`, error);
                                return {
                                    ...status,
                                    userData: null
                                };
                            }
                        })
                    );

                    setStatusesWithUsers(statusesWithUserData);
                }
            } catch (error) {
                console.error('Error fetching statuses:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleStatusClick = (status) => {
        // Implement status click handler
        setSelectedStatus(status);
    };

    const markStatusAsViewed = async () => { }

    // Fonction pour faire défiler vers la gauche
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -200, // Ajustez cette valeur selon vos besoins
                behavior: 'smooth'
            });
        }
    };

    // Fonction pour faire défiler vers la droite
    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: 200, // Ajustez cette valeur selon vos besoins
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="status-feed-container">
            {loading && <Loading />}
            <div className="status-section" ref={scrollContainerRef}>
                {/* Bouton de défilement gauche */}
                <button className="scroll-button scroll-left" onClick={scrollLeft}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>

                {/* Liste des statuts */}
                {statusesWithUsers.map(status => (
                    <StatusItem
                        key={status.statusID}
                        status={status}
                        user={status.userData}
                        onClick={handleStatusClick}
                        isCurrentUser={status.userID === currentUser?.uid}
                        hasViewed={false} // Logique à implémenter pour vérifier si le statut a été vu
                    />
                ))}

                {/* Bouton de défilement droit */}
                <button className="scroll-button scroll-right" onClick={scrollRight}>
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>

            {/* Visualiseur de statut (à implémenter) */}
            {selectedStatus && (
                <StatusViewer
                    statuses={statusesWithUsers}
                    initialStatusId={selectedStatus.statusID}
                    onClose={() => setSelectedStatus(null)}
                    currentUserID={currentUser?.uid}
                    markStatusAsViewed={markStatusAsViewed}
                />
            )}
        </div>
    );
};
