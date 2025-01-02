import React, { useEffect, useState } from 'react';
import ButtonAdd from '../../customs/ButtonAdd';
import CardList from '../../utils/card/CardList';
import CardItem from '../../utils/card/CardItem';
import { fetchApprovedAds } from '../../services/adServices';
import Toast from '../../customs/Toast';
import Loading from '../../customs/Loading';
import '../../styles/HomePage.scss';

export default function HomePage() {
    const [adsApproved, setAdsApproved] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    useEffect(() => {
        const getApprovedAds = async () => {
            setIsLoading(true);
            const result = await fetchApprovedAds();
            if (result.success) {
                const approvedAds = Array.isArray(result?.approvedAds) ? result?.approvedAds : [];
                setAdsApproved(approvedAds);
                setIsLoading(false);
            }

        }

        getApprovedAds();
    }, []);



    return (
        <div className='home-page'>
            {isLoading && <Loading />}
            <ButtonAdd />
            {adsApproved.length > 0 ?
                <CardList>
                    {adsApproved.map((item, index) => (
                        <CardItem
                            key={index}
                            ad={item}
                        />
                    ))}
                </CardList>
                :
                <p>Aucunes annonces publiées</p>
            }

            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
};
