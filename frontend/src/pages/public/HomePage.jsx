import React, { useContext, useEffect, useState } from 'react';
import ButtonAdd from '../../customs/ButtonAdd';
import CardList from '../../utils/card/CardList';
import CardItem from '../../utils/card/CardItem';
import { fetchApprovedPosts } from '../../routes/postRoutes';
import { useNavigate } from 'react-router-dom';
import Toast from '../../customs/Toast';
import Loading from '../../customs/Loading';
import TabFilter from '../../components/tab-filter/TabFilter';
import { AuthContext } from '../../contexts/AuthContext';
import PubsBanner from '../../utils/pubs/PubsBanner';
import '../../styles/HomePage.scss';

export default function HomePage() {
    const navigate = useNavigate();
    const { currentUser, userData } = useContext(AuthContext);
    const [adsApproved, setAdsApproved] = useState([]);
    const [filteredAds, setFilteredAds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    useEffect(() => {
        const getApprovedAds = async () => {
            setIsLoading(true); // 🔥 Ajouté pour éviter un bug où le chargement ne s'affiche pas

            try {
                const result = await fetchApprovedPosts();
                if (result.success) {
                    const approvedAds = Array.isArray(result?.approvedPosts) ? result?.approvedPosts : [];
                    setAdsApproved(approvedAds);
                    setFilteredAds(approvedAds); // Par défaut, on affiche tout
                } else {
                    throw new Error("Erreur lors du chargement des annonces.");
                }
            } catch (error) {
                setToast({ show: true, type: "error", message: error.message });
            } finally {
                setIsLoading(false);
            }
        };

        getApprovedAds();
    }, []);


    return (
        <div className="home-page">
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

                    {isLoading ? <Loading /> : (
                        <>
                            {filteredAds.length > 0 ? (
                                <CardList>
                                    {filteredAds.map((item, index) => (
                                        <CardItem key={index} post={item} />
                                    ))}
                                </CardList>
                            ) : (
                                <p className='no-post'>Aucune annonce publiée</p>
                            )}
                        </>
                    )}

                    <Toast
                        show={toast.show}
                        type={toast.type}
                        message={toast.message}
                        onClose={() => setToast({ ...toast, show: false })}
                    />
                </div>

                <div className="ads-sidebar">
                    <h4>Publicités sponsorisées</h4>

                    {/* Tu peux ajouter d'autres bannières ici */}
                </div>
            </div>
        </div>

    );
};
