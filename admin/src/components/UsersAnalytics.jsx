import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import Loading from '../customs/Loading';
import { UserActivityByHourChart, UserRegistrationChart, UserRolesChart, UserStatusChart } from './UsersOverviewChart';
import '../styles/UsersAnalytics.scss';

const UsersAnalytics = ({
    users,
    online,
    offline,
    isLoading
}) => {
    const { language } = useContext(LanguageContext);
    const isFrenchlanguage = language === 'FR';

    if (isLoading) return <Loading />

    return (
        <div className="users-analytics">
            <h2>{isFrenchlanguage ? 'Analyse des Utilisateurs' : 'User Analytics'}</h2>

            <div className="analytics-grid">
                <div className="analytics-card">
                    <UserStatusChart
                        online={online}
                        offline={offline}
                    />
                </div>

                <div className="analytics-card">
                    <UserRolesChart users={users} />
                </div>

                <div className="analytics-card full-width">
                    <UserRegistrationChart users={users} />
                </div>

                <div className="analytics-card full-width">
                    <UserActivityByHourChart users={users} />
                </div>
            </div>
        </div>
    );
};

export default UsersAnalytics;
