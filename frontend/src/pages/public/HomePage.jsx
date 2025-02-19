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
import { fetchPubs } from '../../routes/apiRoutes';
import BusinessPost from '../../utils/business-posts/BusinessPost';
import { fetchCombinedPosts } from '../../helpers/algorythms';
import BannerCarousel from '../../utils/business-posts/BannerCarousel';
import { banners, spots } from '../../data';
import SpotPost from '../../utils/business-posts/SpotPost';
import '../../styles/HomePage.scss';

export default function HomePage() {
    const navigate = useNavigate();
    const { currentUser, userData } = useContext(AuthContext);
    const [adsApproved, setAdsApproved] = useState([]);
    const [businessPosts, setBusinessPosts] = useState([]);
    const [filteredAds, setFilteredAds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [combinedPosts, setCombinedPosts] = useState([]);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    useEffect(() => {
        const getApprovedAds = async () => {
            setIsLoading(true);
            try {
                const [postsResult, businessResult] = await Promise.all([
                    fetchApprovedPosts(),
                    fetchPubs(),
                ])
                setAdsApproved(postsResult.approvedPosts);
                setFilteredAds(postsResult.approvedPosts);
                setBusinessPosts(businessResult.pubs);
            } catch (error) {
                setToast({ show: true, type: "error", message: "Erreur lors du chargement des annonces." });
            } finally {
                setIsLoading(false);
            }
        };

        getApprovedAds();
    }, []);

    useEffect(() => {
        const loadPosts = async () => {
            setIsLoading(true);
            const posts = await fetchCombinedPosts();
            setCombinedPosts(posts);
            setIsLoading(false);
        };

        loadPosts();
    }, []);

    const mergedPosts = [];
    const adsCopy = [...filteredAds];
    const businessCopy = [...businessPosts];

    while (adsCopy.length || businessCopy.length) {
        mergedPosts.push(...adsCopy.splice(0, 1)); // Ajoute 3 annonces normales
        if (businessCopy.length) mergedPosts.push(businessCopy.shift()); // Ajoute 1 annonce Business
    }


    return (
        <div className="home-page">
            <div style={{ marginTop: '1rem' }}></div>
            <BannerCarousel banners={banners} />

            <div style={{ marginBottom: '1rem' }}></div>

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
                        {combinedPosts.length > 0 ? (
                            combinedPosts.map((item, index) =>
                                item.type === 'business' ? (
                                    <BusinessPost key={index} post={item} />
                                ) : (
                                    <CardItem key={index} post={item} />
                                )
                            )
                        ) : (
                            <p className='no-post'>Aucune annonce publiée</p>
                        )}
                    </CardList>

                    <Toast
                        show={toast.show}
                        type={toast.type}
                        message={toast.message}
                        onClose={() => setToast({ ...toast, show: false })}
                    />
                </div>

                <div className="pubs-sidebar">
                    {businessPosts.map((post, index) =>
                        post &&
                            post.type === 'business' &&
                            post.pubType === 'native' ? (
                            <BusinessPost key={index} post={post} />
                        ) : null
                    )}
                    <SpotPost spots={spots} />
                </div>
            </div>
        </div>

    );
};
