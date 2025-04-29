import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchPostsByUserID } from '../../routes/userRoutes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from "chart.js";
import PostsAnalytics from '../../utils/PostsAnalytics';
import ProfileAnalytics from '../../utils/ProfileAnalytics';
import Loading from '../../customs/Loading';
import '../../styles/DashboardPanel.scss';
// import StatusCreator from '../../components/status/StatusCreator';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export default function DashboardPanel() {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [ads, setAds] = useState([]);
    const [adsPending, setAdsPending] = useState([]);
    const [adsApproved, setAdsApproved] = useState([]);
    const [adsRefused, setAdsRefused] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;


        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                if (!currentUser) return;

                const userID = currentUser.uid;
                const data = await fetchPostsByUserID(userID);

                if (isMounted && data) {
                    setAds(data.postsData?.allAds || []);
                    setAdsPending(data.postsData?.pendingAds || []);
                    setAdsApproved(data.postsData?.approvedAds || []);
                    setAdsRefused(data.postsData?.refusedAds || []);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des annonces:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();

        return () => { isMounted = false; };
    }, [currentUser]);

    if (isLoading) return <Loading />

    return (
        <div className='panel'>
            <div className='head'>
                <h3>Aperçus</h3>
                <div className='buttons'>
                    <button className='add-new-ad' onClick={() => navigate('/auth/create-post')}>
                        <FontAwesomeIcon icon={faPlusSquare} className='icon' />
                        <span>Créer une annonce</span>
                    </button>
                </div>
            </div>

            {/* {openStatusCreator && (
                <StatusCreator />
            )} */}

            <PostsAnalytics
                posts={ads}
                postsApproved={adsApproved}
                postsPending={adsPending}
                postsRefused={adsRefused}
                isLoading={isLoading}
            />

            <ProfileAnalytics />
        </div>
    );
};
