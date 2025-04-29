import React, { useContext } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts';
import { LanguageContext } from '../contexts/LanguageContext';

// Online/Offline Status Chart
export const UserStatusChart = ({ online, offline }) => {
    const { language } = useContext(LanguageContext);
    const isFrenchlanguage = language === 'FR';

    // Prepare data for the chart
    const data = [
        {
            name: isFrenchlanguage ? 'En ligne' : 'Online',
            value: online.length,
            fill: '#4caf50'
        },
        {
            name: isFrenchlanguage ? 'Hors ligne' : 'Offline',
            value: offline.length,
            fill: '#9e9e9e'
        }
    ];

    return (
        <div className="chart-container">
            <h3>{isFrenchlanguage ? 'Statut des Utilisateurs' : 'User Status'}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value) => [value, isFrenchlanguage ? 'Utilisateurs' : 'Users']}
                        labelFormatter={(label) => label}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

// User Registration Timeline (if createdAt is available)
export const UserRegistrationChart = ({ users }) => {
    const { language } = useContext(LanguageContext);
    const isFrenchlanguage = language === 'FR';

    // Group users by registration date
    const groupedByDate = users.reduce((acc, user) => {
        // Skip users without createdAt
        if (!user.createdAt) {
            return acc;
        }

        let date;
        try {
            // Handle different possible formats of createdAt
            if (user.createdAt.toDate && typeof user.createdAt.toDate === 'function') {
                // Firestore Timestamp
                date = user.createdAt.toDate();
            } else if (user.createdAt._seconds) {
                // Firestore Timestamp converted to object
                date = new Date(user.createdAt._seconds * 1000);
            } else if (typeof user.createdAt === 'string') {
                // ISO string or other string format
                date = new Date(user.createdAt);
            } else if (typeof user.createdAt === 'number') {
                // Unix timestamp in milliseconds
                date = new Date(user.createdAt);
            } else {
                // Try direct conversion
                date = new Date(user.createdAt);
            }

            // Validate the date is valid before using it
            if (isNaN(date.getTime())) {
                return acc;
            }

            const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format

            if (!acc[dateStr]) {
                acc[dateStr] = 0;
            }
            acc[dateStr]++;
        } catch (error) {
            console.warn('Error processing date for user:', user.id || 'unknown');
        }

        return acc;
    }, {});

    // Convert to array format for Recharts and sort by date
    const dailyData = Object.entries(groupedByDate)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate cumulative registrations
    let cumulativeCount = 0;
    const cumulativeData = dailyData.map(item => {
        cumulativeCount += item.count;
        return {
            date: item.date,
            count: item.count,
            cumulative: cumulativeCount
        };
    });

    // If no valid data, show a message
    if (cumulativeData.length === 0) {
        return (
            <div className="chart-container empty-chart">
                <h3>{isFrenchlanguage ? 'Inscriptions d\'Utilisateurs' : 'User Registrations'}</h3>
                <p className="no-data-message">
                    {isFrenchlanguage
                        ? 'Aucune donnée de date d\'inscription disponible'
                        : 'No registration date data available'}
                </p>
            </div>
        );
    }

    return (
        <div className="chart-container">
            <h3>{isFrenchlanguage ? 'Inscriptions d\'Utilisateurs' : 'User Registrations'}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    data={cumulativeData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        tickFormatter={(dateStr) => {
                            try {
                                const date = new Date(dateStr);
                                return `${date.getDate()}/${date.getMonth() + 1}`;
                            } catch (e) {
                                return dateStr;
                            }
                        }}
                    />
                    <YAxis />
                    <Tooltip
                        formatter={(value, name) => [
                            value,
                            name === 'count'
                                ? (isFrenchlanguage ? 'Nouveaux utilisateurs' : 'New users')
                                : (isFrenchlanguage ? 'Total utilisateurs' : 'Total users')
                        ]}
                        labelFormatter={(dateStr) => {
                            try {
                                const date = new Date(dateStr);
                                return date.toLocaleDateString(isFrenchlanguage ? 'fr-FR' : 'en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                });
                            } catch (e) {
                                return dateStr;
                            }
                        }}
                    />
                    <Legend />
                    <Area
                        type="monotone"
                        dataKey="count"
                        name={isFrenchlanguage ? 'Nouveaux utilisateurs' : 'New users'}
                        fill="#8884d8"
                        stroke="#8884d8"
                        stackId="1"
                    />
                    <Area
                        type="monotone"
                        dataKey="cumulative"
                        name={isFrenchlanguage ? 'Total utilisateurs' : 'Total users'}
                        fill="#82ca9d"
                        stroke="#82ca9d"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

// User Activity by Hour (if lastLogin is available)
export const UserActivityByHourChart = ({ users }) => {
    const { language } = useContext(LanguageContext);
    const isFrenchlanguage = language === 'FR';

    // Initialize hours array (0-23)
    const hourCounts = Array(24).fill(0);

    // Count users by last login hour
    users.forEach(user => {
        if (!user.lastLoginAt) return;

        let date;
        try {
            // Handle different possible formats of lastLogin
            if (user.lastLoginAt.toDate && typeof user.lastLoginAt.toDate === 'function') {
                date = user.lastLoginAt.toDate();
            } else if (user.lastLoginAt._seconds) {
                date = new Date(user.lastLoginAt._seconds * 1000);
            } else if (typeof user.lastLoginAt === 'string') {
                date = new Date(user.lastLoginAt);
            } else if (typeof user.lastLoginAt === 'number') {
                date = new Date(user.lastLoginAt);
            } else {
                date = new Date(user.lastLoginAt);
            }

            // Validate the date is valid before using it
            if (isNaN(date.getTime())) return;

            const hour = date.getHours();
            hourCounts[hour]++;
        } catch (error) {
            console.warn('Error processing lastLogin for user:', user.id || 'unknown');
        }
    });

    // Prepare data for the chart
    const data = hourCounts.map((count, hour) => ({
        hour: hour.toString().padStart(2, '0') + ':00',
        count
    }));

    // Check if we have any activity data
    const hasActivityData = hourCounts.some(count => count > 0);

    if (!hasActivityData) {
        return (
            <div className="chart-container empty-chart">
                <h3>{isFrenchlanguage ? 'Activité par Heure' : 'Activity by Hour'}</h3>
                <p className="no-data-message">
                    {isFrenchlanguage
                        ? 'Aucune donnée d\'activité disponible'
                        : 'No activity data available'}
                </p>
            </div>
        );
    }

    return (
        <div className="chart-container">
            <h3>{isFrenchlanguage ? 'Activité par Heure' : 'Activity by Hour'}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip
                        formatter={(value) => [value, isFrenchlanguage ? 'Utilisateurs' : 'Users']}
                    />
                    <Legend />
                    <Bar
                        dataKey="count"
                        name={isFrenchlanguage ? 'Utilisateurs actifs' : 'Active users'}
                        fill="#ff9800"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

// User Roles Distribution (if role is available)
export const UserRolesChart = ({ users }) => {
    const { language } = useContext(LanguageContext);
    const isFrenchlanguage = language === 'FR';

    // Count users by role
    const roleCount = users.reduce((acc, user) => {
        const role = user.role || 'user'; // Default to 'user' if no role specified

        if (!acc[role]) {
            acc[role] = 0;
        }
        acc[role]++;
        return acc;
    }, {});

    // Convert to array format for Recharts
    const data = Object.entries(roleCount)
        .map(([role, count]) => ({
            role: role.charAt(0).toUpperCase() + role.slice(1), // Capitalize role name
            count
        }))
        .sort((a, b) => b.count - a.count);

    // Colors for different roles
    const ROLE_COLORS = {
        Admin: '#f44336',
        Moderator: '#ff9800',
        Editor: '#2196f3',
        User: '#4caf50',
        Visitor: '#9e9e9e'
    };

    return (
        <div className="chart-container">
            <h3>{isFrenchlanguage ? 'Distribution des Rôles' : 'Role Distribution'}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="role"
                    >
                        {data.map((entry) => (
                            <Cell
                                key={`cell-${entry.role}`}
                                fill={ROLE_COLORS[entry.role] || '#8884d8'}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value) => [value, isFrenchlanguage ? 'Utilisateurs' : 'Users']}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
