import React, { useEffect, useState } from 'react';
import AdsStatistics from './AdsStatistics';
import UsersStatistics from './UsersStatistics';
import PendingAds from './PendingAds';
import { fetchPendingAds } from '../../services/adServices';
import AdminAdsChart from './AdminAdsChart';
import PaymentStats from '../../components/payment-stats/PaymentStats';
import '../../styles/DashboardPanel.scss';

export default function DashboardPanel() {
    const [adsPending, setAdsPending] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const pendingAds = await fetchPendingAds();
                setAdsPending(pendingAds);
            } catch (error) {
                console.error('Erreur lors de la récupération des annonces en attente:', error);
            }
        };

        fetchData();
    }, []);


    return (
        <div className='panel'>
            <h2>Tableau de bord</h2>
            <div className='panel-body'>
                <div className='panel-left'>
                    <AdsStatistics />
                    <UsersStatistics />

                </div>
                <AdminAdsChart />
            </div>
            <PaymentStats />
            <PendingAds pendingAds={adsPending} />
        </div>
    );
};
