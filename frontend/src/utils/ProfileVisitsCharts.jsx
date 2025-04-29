import React, { useContext } from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { LanguageContext } from '../contexts/LanguageContext';

/**
 * Component to display profile visits analytics
 */
export const ProfileVisitsCharts = ({ userData }) => {
    const { language } = useContext(LanguageContext);
    const isFrenchlanguage = language === 'FR';

    // Format data for today's visits chart
    const formatTodayVisitsData = () => {
        if (!userData?.profileVisitsToday) return [];

        return Object.entries(userData.profileVisitsToday).map(([time, count]) => ({
            time,
            visits: count
        }));
    };

    // Format data for visits by city chart
    const formatCityVisitsData = () => {
        if (!userData?.profileVisitsByCity) return [];

        return Object.entries(userData.profileVisitsByCity).map(([city, count]) => ({
            city,
            visits: count
        }));
    };

    const todayVisitsData = formatTodayVisitsData();
    const cityVisitsData = formatCityVisitsData();

    return (
        <div className="profile-visits-charts">
            <div className="chart-container">
                <h3>
                    {isFrenchlanguage
                        ? "Visites de votre profil aujourd'hui"
                        : "Today's Profile Visits"}
                </h3>
                {todayVisitsData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={todayVisitsData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip
                                formatter={(value) => [value, isFrenchlanguage ? 'Visites' : 'Visits']}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="visits"
                                name={isFrenchlanguage ? "Visites aujourd'hui" : "Today's visits"}
                                stroke="#36a2eb"
                                strokeWidth={2}
                                activeDot={{ r: 8 }}
                                fill="rgba(54, 162, 235, 0.5)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="no-data-message">
                        {isFrenchlanguage
                            ? "Aucune visite enregistrée aujourd'hui"
                            : "No visits recorded today"}
                    </div>
                )}
            </div>

            <div className="chart-container">
                <h3>
                    {isFrenchlanguage
                        ? "Visites par ville"
                        : "Visits by City"}
                </h3>
                {cityVisitsData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={cityVisitsData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="city" />
                            <YAxis />
                            <Tooltip
                                formatter={(value) => [value, isFrenchlanguage ? 'Visites' : 'Visits']}
                            />
                            <Legend />
                            <Bar
                                dataKey="visits"
                                name={isFrenchlanguage ? "Visites par ville" : "Visits by city"}
                                fill="rgba(54, 162, 235, 0.5)"
                                stroke="rgba(54, 162, 235, 1)"
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="no-data-message">
                        {isFrenchlanguage
                            ? "Aucune donnée de visite par ville disponible"
                            : "No city visit data available"}
                    </div>
                )}
            </div>

            <div className="chart-container">
                <h3>
                    {isFrenchlanguage
                        ? "Résumé des visites"
                        : "Visits Summary"}
                </h3>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-value">
                            {userData?.totalProfileVisits || 0}
                        </div>
                        <div className="stat-label">
                            {isFrenchlanguage ? "Visites totales" : "Total visits"}
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-value">
                            {todayVisitsData.reduce((sum, item) => sum + item.visits, 0)}
                        </div>
                        <div className="stat-label">
                            {isFrenchlanguage ? "Visites aujourd'hui" : "Today's visits"}
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-value">
                            {cityVisitsData.length}
                        </div>
                        <div className="stat-label">
                            {isFrenchlanguage ? "Villes différentes" : "Different cities"}
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-value">
                            {userData?.uniqueVisitors || 0}
                        </div>
                        <div className="stat-label">
                            {isFrenchlanguage ? "Visiteurs uniques" : "Unique visitors"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Component to display a simplified version of profile visits for the dashboard
 */
export const ProfileVisitsMiniCharts = ({ userData }) => {
    const { language } = useContext(LanguageContext);
    const isFrenchlanguage = language === 'FR';

    // Format data for today's visits chart
    const todayVisitsData = userData?.profileVisitsToday
        ? Object.entries(userData.profileVisitsToday).map(([time, count]) => ({
            time,
            visits: count
        }))
        : [];

    // Get top cities (limited to 5)
    const topCitiesData = userData?.profileVisitsByCity
        ? Object.entries(userData.profileVisitsByCity)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([city, count]) => ({
                city,
                visits: count
            }))
        : [];

    return (
        <div className="profile-visits-mini-charts">
            <div className="mini-chart-container">
                <h4>
                    {isFrenchlanguage
                        ? "Visites aujourd'hui"
                        : "Today's Visits"}
                </h4>
                {todayVisitsData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={150}>
                        <LineChart
                            data={todayVisitsData}
                            margin={{
                                top: 5,
                                right: 5,
                                left: 5,
                                bottom: 5,
                            }}
                        >
                            <Tooltip
                                formatter={(value) => [value, isFrenchlanguage ? 'Visites' : 'Visits']}
                            />
                            <Line
                                type="monotone"
                                dataKey="visits"
                                stroke="#36a2eb"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="no-data-message small">
                        {isFrenchlanguage
                            ? "Aucune visite aujourd'hui"
                            : "No visits today"}
                    </div>
                )}
            </div>

            <div className="mini-chart-container">
                <h4>
                    {isFrenchlanguage
                        ? "Top 5 villes"
                        : "Top 5 Cities"}
                </h4>
                {topCitiesData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={150}>
                        <BarChart
                            data={topCitiesData}
                            layout="vertical"
                            margin={{
                                top: 5,
                                right: 5,
                                left: 50,
                                bottom: 5,
                            }}
                        >
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="city"
                                type="category"
                                width={50}
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                                formatter={(value) => [value, isFrenchlanguage ? 'Visites' : 'Visits']}
                            />
                            <Bar
                                dataKey="visits"
                                fill="rgba(255, 99, 132, 0.5)"
                                stroke="rgba(255, 99, 132, 1)"
                                barSize={15}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="no-data-message small">
                        {isFrenchlanguage
                            ? "Aucune donnée de ville"
                            : "No city data"}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileVisitsCharts;
