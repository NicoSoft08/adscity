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
import '../../styles/HomePage.scss';

export default function HomePage() {
    const navigate = useNavigate();
    const { currentUser, userData } = useContext(AuthContext);
    const [adsApproved, setAdsApproved] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    useEffect(() => {
        const getApprovedAds = async () => {
            setIsLoading(true);
            const result = await fetchApprovedPosts();
            if (result.success) {
                const approvedAds = Array.isArray(result?.approvedPosts) ? result?.approvedPosts : [];
                setAdsApproved(approvedAds);
                setIsLoading(false);
            }
        }

        getApprovedAds();
    }, []);


    return (
        <div className='home-page'>
            <TabFilter
                currentUser={currentUser}
                userData={userData}
                setToast={setToast}
                toast={toast}
                adsApproved={adsApproved}
                setAdsApproved={setAdsApproved}
                onFilterClick={() => navigate('/filters')}
            />
            {isLoading && <Loading />}
            <ButtonAdd />
            {adsApproved.length > 0 ?
                < CardList >
                    {
                        adsApproved.map((item, index) => (
                            <CardItem
                                key={index}
                                post={item}
                            />
                        ))
                    }
                </CardList >
                :
                <p>Aucunes annonces publiées</p>
            }

            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, show: false })}
            />  
        </div >
    );
};
