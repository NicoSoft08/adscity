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
// import { fetchPubs } from '../../routes/apiRoutes';
// import { fetchCombinedPosts } from '../../helpers/algorythms';
// import PubsSwitcher from '../../utils/pubs/PubsSwitcher';
// import { MastheadSlider, NativeDisplayPub, VideoInFeedPub } from '../../utils/pubs/Pubs';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebaseConfig';
import { Banner } from '../../utils/pubs/Pubs';
import { banner } from '../../config/images';
import { LanguageContext } from '../../contexts/LanguageContext';
// import StatusFeed from './StatusFeed';
import '../../styles/HomePage.scss';

export default function HomePage() {
    const navigate = useNavigate();
    const { currentUser, userData } = useContext(AuthContext);
    const { language } = useContext(LanguageContext);
    const [adsApproved, setAdsApproved] = useState([]);
    // const [businessPosts, setBusinessPosts] = useState([]);
    const [filteredAds, setFilteredAds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // const [combinedPosts, setCombinedPosts] = useState([]);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    useEffect(() => {
        logEvent(analytics, 'view_home_page', {
            page_path: '/home',
            user_id: currentUser?.uid,
        });
        const getApprovedAds = async () => {
            setIsLoading(true);

            const result = await fetchApprovedPosts();
            if (result.success) {
                setAdsApproved(result.approvedPosts);
                setFilteredAds(result.approvedPosts);
                setIsLoading(false);
            }

            // try {
            //     const [postsResult, businessResult] = await Promise.all([
            //         fetchApprovedPosts(),
            //         fetchPubs(),
            //     ])
            //     setAdsApproved(postsResult.approvedPosts);
            //     setFilteredAds(postsResult.approvedPosts);
            //     setBusinessPosts(businessResult.pubs);
            //     setIsLoading(false);
            // } catch (error) {
            //     setToast({ show: true, type: "error", message: "Erreur lors du chargement des annonces." });
            // } finally {
            //     setIsLoading(false);
            // }
        };

        getApprovedAds();
    }, [currentUser]);

    // useEffect(() => {
    //     const loadPosts = async () => {
    //         setIsLoading(true);
    //         const posts = await fetchCombinedPosts();
    //         setCombinedPosts(posts);
    //         setIsLoading(false);
    //     };

    //     loadPosts();
    // }, []);

    // const mergedPosts = [];
    // const adsCopy = [...filteredAds];
    // const businessCopy = [...businessPosts];

    // while (adsCopy.length || businessCopy.length) {
    //     mergedPosts.push(...adsCopy.splice(0, 1)); // Ajoute 3 annonces normales
    //     if (businessCopy.length) mergedPosts.push(businessCopy.shift()); // Ajoute 1 annonce Business
    // }


    return (
        <div className="home-page">
            <div style={{ marginTop: '1rem' }}></div>
            <Banner domainName={'adscity.net'} img={banner} />

            {/* Status Feed */}
            {/* <StatusFeed /> */}

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

                    {/* <CardList>
                        {combinedPosts.length > 0 ? (
                            combinedPosts.map((item, index) => {
                                const pubElement = item.type === 'business' ? (
                                    <NativeDisplayPub key={index} pub={item} />
                                ) : (
                                    <CardItem key={index} post={item} />
                                );

                                if ((index + 1) % 4 === 0) {
                                    return (
                                        <React.Fragment key={index}>
                                            {pubElement}
                                            <VideoInFeedPub pub={item} />
                                        </React.Fragment>
                                    )
                                } else {
                                    return pubElement;
                                }
                            })
                        ) : (
                            <p className='no-post'>Aucune annonce publiée</p>
                        )}
                    </CardList> */}

                    <Toast
                        show={toast.show}
                        type={toast.type}
                        message={toast.message}
                        onClose={() => setToast({ ...toast, show: false })}
                    />
                </div>

                {/* <div className="pubs-sidebar">
                    {businessPosts.map((post, index) =>
                        post &&
                        post.type === 'business' &&
                        <PubsSwitcher key={index} pub={post} />
                    )}
                </div> */}
            </div>
        </div>

    );
};
