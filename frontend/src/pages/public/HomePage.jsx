import React, { useContext, useEffect, useState } from 'react';
import ButtonAdd from '../../customs/ButtonAdd';
import CardList from '../../utils/card/CardList';
import { useNavigate } from 'react-router-dom';
import Toast from '../../customs/Toast';
import Loading from '../../customs/Loading';
import TabFilter from '../../components/tab-filter/TabFilter';
import { AuthContext } from '../../contexts/AuthContext';
import { fetchApprovedPosts } from '../../routes/postRoutes';
import CardItem from '../../utils/card/CardItem';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import { Banner } from '../../utils/pubs/Pubs';
import { banner } from '../../config/images';
import { LanguageContext } from '../../contexts/LanguageContext';
import '../../styles/HomePage.scss';

export default function HomePage() {
    const navigate = useNavigate();
    const { currentUser, userData } = useContext(AuthContext);
    const { language } = useContext(LanguageContext);
    const [adsApproved, setAdsApproved] = useState([]);
    const [filteredAds, setFilteredAds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    useEffect(() => {
        logEvent(analytics, 'view_home_page', {
            page_path: '/home',
            user_id: currentUser?.uid,
        });

        const getApprovedAds = async () => {
            setIsLoading(true);
            try {
                const result = await fetchApprovedPosts();
                if (result && result.success) {
                    setAdsApproved(result.approvedPosts);
                    setFilteredAds(result.approvedPosts);
                } else {
                    // Gérer l'erreur
                    console.error("Erreur lors de la récupération des annonces:", result?.message);
                    setToast({
                        show: true,
                        type: 'error',
                        message: 'Erreur lors du chargement des annonces'
                    });
                }
            } catch (error) {
                console.error("Exception lors de la récupération des annonces:", error);
                setToast({
                    show: true,
                    type: 'error',
                    message: 'Erreur lors du chargement des annonces'
                });
            } finally {
                setIsLoading(false); // Toujours exécuté, que la requête réussisse ou échoue
            }
        };

        getApprovedAds();
    }, [currentUser]);


    return (
        <div className="home-page">
            <div style={{ marginTop: '1rem' }}></div>
            <Banner domainName={'adscity.net'} img={banner} />

            <div className="home-container">
                <div className="main-content">
                    <TabFilter
                        currentUser={currentUser}
                        userData={userData}
                        setToast={setToast}
                        toast={toast}
                        adsApproved={adsApproved}
                        setIsLoading={setIsLoading}
                        setFilteredAds={setFilteredAds}
                        onFilterClick={() => navigate('/filters')}
                    />
                    <ButtonAdd />

                    {isLoading && <Loading />}

                    <CardList>
                        {filteredAds.length > 0 ? (
                            filteredAds.map((item, index) => (
                                <CardItem key={index} post={item} />
                            ))
                        ) : (
                            <p className='no-ads'>
                                {language === 'fr' ? 'Aucune annonce trouvée' : 'No ads found'}
                            </p>
                        )}
                    </CardList>

                    <Toast
                        show={toast.show}
                        type={toast.type}
                        message={toast.message}
                        onClose={() => setToast({ ...toast, show: false })}
                    />
                </div>
            </div>
        </div>
    );
};
