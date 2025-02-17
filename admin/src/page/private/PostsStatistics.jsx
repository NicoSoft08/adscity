import React, { useContext, useEffect, useState } from 'react';
import {
    faListAlt,
    faClock,
    faCheckCircle,
    faTimesCircle,
    faPlusSquare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    fetchAllPosts,
    fetchApprovedPosts,
    fetchPendingPosts,
    fetchRefusedPosts
} from '../../routes/postRoutes';
import { useNavigate } from 'react-router-dom';
import '../../styles/PostsStatistics.scss';
import '../../styles/PhoneInput.scss';
import { AuthContext } from '../../contexts/AuthContext';
import Toast from '../../customs/Toast';


const Stats = ({ allPosts, pendingPosts, approvedPosts, refusedPosts }) => {
    return (
        <div className="ads-statistics">
            {/* Bloc pour toutes les annonces */}
            <div className="stat-block all">
                <FontAwesomeIcon icon={faListAlt} className="icon" />
                <div className="stat-info">
                    <h3>Toutes</h3>
                    <p>{allPosts} annonce(s)</p>
                </div>
            </div>

            {/* Bloc pour les annonces en attente */}
            <div className="stat-block pending">
                <FontAwesomeIcon icon={faClock} className="icon" />
                <div className="stat-info">
                    <h3>En attente</h3>
                    <p>{pendingPosts} annonce(s)</p>
                </div>
            </div>

            {/* Bloc pour les annonces approuvées */}
            <div className="stat-block approved">
                <FontAwesomeIcon icon={faCheckCircle} className="icon" />
                <div className="stat-info">
                    <h3>Approuvées</h3>
                    <p>{approvedPosts} annonce(s)</p>
                </div>
            </div>

            {/* Bloc pour les annonces refusées */}
            <div className="stat-block refused">
                <FontAwesomeIcon icon={faTimesCircle} className="icon" />
                <div className="stat-info">
                    <h3>Refusées</h3>
                    <p>{refusedPosts} annonce(s)</p>
                </div>
            </div>
        </div>
    );
};


export default function PostsStatistics() {
    const navigate = useNavigate();
    const { currentUser, userData } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [postsPending, setPostsPending] = useState([]);
    const [postsApproved, setPostsApproved] = useState([]);
    const [postsRefused, setPostsRefused] = useState([]);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });


    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Fetch all the ads data in parallel
                const [allPosts, pendingPosts, approvedPosts, refusedPosts] = await Promise.all([
                    fetchAllPosts(),
                    fetchPendingPosts(),
                    fetchApprovedPosts(),
                    fetchRefusedPosts(),
                ]);

                // Vérification des données renvoyées
                setPosts(allPosts?.postsData || []);
                setPostsPending(pendingPosts?.pendingPosts || []);
                setPostsApproved(approvedPosts?.approvedPosts || []);
                setPostsRefused(refusedPosts?.refusedPosts || []);
            } catch (error) {
                console.error('Erreur lors de la récupération des annonces:', error);
            }
        };


        fetchAllData();
    }, []);


    const handleClickAddAdmin = () => {
        if (currentUser && userData.permissions.includes('SUPER_ADMIN')) {
            navigate('create-admin')
        } else {
            setToast({
                show: true,
                type: 'error',
                message: 'Vous n\'avez pas les autorisations pour ajouter un administrateur.'
            });
        }
    };

    return (
        <div className='ads-stats'>
            <div className='head'>
                <h3>Aperçus</h3>
                <button className='add-new-ad' onClick={handleClickAddAdmin}>
                    <FontAwesomeIcon icon={faPlusSquare} className='icon' />
                    <span>Ajouter Admin</span>
                </button>
            </div>

            <Stats
                allPosts={posts?.length || 0}
                pendingPosts={postsPending?.length || 0}
                approvedPosts={postsApproved?.length || 0}
                refusedPosts={postsRefused?.length || 0}
            />

            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
};
