import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { LanguageContext } from '../contexts/LanguageContext';
import Loading from '../customs/Loading';
import ProfileVisitsCharts from './ProfileVisitsCharts';
import '../styles/ProfileAnalytics.scss';

export default function ProfileAnalytics() {
    const { currentUser, userData } = useContext(AuthContext);
    const { language } = useContext(LanguageContext);
    const isFrenchlanguage = language === 'FR';

    if (!currentUser || !userData) return <Loading />

    return (
        <div className="profile-analytics-container">
            <h2>{isFrenchlanguage ? "Analytique de Profil" : "Profile Analytics"}</h2>
            <p className="analytics-intro">
                {isFrenchlanguage
                    ? "Suivez qui visite votre profil et d'où viennent vos visiteurs."
                    : "Track who visits your profile and where your visitors come from."}
            </p>

            <ProfileVisitsCharts userData={userData} />
        </div>
    );
};
