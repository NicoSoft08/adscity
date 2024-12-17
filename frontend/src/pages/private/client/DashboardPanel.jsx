import React from 'react';
import AdsStatistics from './AdsStatistics';
import UserAdsChart from './UserAdsChart';
import '../../../styles/DashboardPanel.scss';

// components

export default function DashboardPanel() {

    return (
        <div className='panel'>
            <h2>Tableau de bord</h2>
            <div className='panel-body'>
                <div className='panel-left'>
                    <AdsStatistics />
                </div>
                <UserAdsChart />
            </div>
        </div>
    );
};
