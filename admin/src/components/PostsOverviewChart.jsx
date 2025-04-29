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
    Cell
} from 'recharts';
import { LanguageContext } from '../contexts/LanguageContext';

// Bar Chart for Posts Status
export const PostsStatusBarChart = ({ posts, postsApproved, postsRefused, postsPending }) => {
    const { language } = useContext(LanguageContext);
    const isFrenchlanguage = language === 'FR';

    // Prepare data for the chart
    const data = [
        {
            name: isFrenchlanguage ? 'Total' : 'Total',
            value: posts.length,
            fill: '#8884d8'
        },
        {
            name: isFrenchlanguage ? 'Approuvées' : 'Approved',
            value: postsApproved.length,
            fill: '#4caf50'
        },
        {
            name: isFrenchlanguage ? 'En attente' : 'Pending',
            value: postsPending.length,
            fill: '#ff9800'
        },
        {
            name: isFrenchlanguage ? 'Refusées' : 'Refused',
            value: postsRefused.length,
            fill: '#f44336'
        }
    ];

    return (
        <div className="chart-container">
            <h3>{isFrenchlanguage ? 'Statut des Annonces' : 'Posts Status'}</h3>
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
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                        formatter={(value) => [value, isFrenchlanguage ? 'Nombre d\'annonces' : 'Number of posts']}
                        labelFormatter={(label) => label}
                    />
                    <Legend />
                    <Bar dataKey="value" name={isFrenchlanguage ? 'Nombre d\'annonces' : 'Number of posts'} fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

// Pie Chart for Posts Distribution
export const PostsDistributionPieChart = ({ postsApproved, postsRefused, postsPending }) => {
    const { language } = useContext(LanguageContext);
    const isFrenchlanguage = language === 'FR';

    // Prepare data for the chart
    const data = [
        {
            name: isFrenchlanguage ? 'Approuvées' : 'Approved',
            value: postsApproved.length
        },
        {
            name: isFrenchlanguage ? 'En attente' : 'Pending',
            value: postsPending.length
        },
        {
            name: isFrenchlanguage ? 'Refusées' : 'Refused',
            value: postsRefused.length
        }
    ];

    // Filter out categories with zero posts
    const filteredData = data.filter(item => item.value > 0);

    // Colors for the pie chart
    const COLORS = ['#4caf50', '#ff9800', '#f44336'];

    return (
        <div className="chart-container">
            <h3>{isFrenchlanguage ? 'Distribution des Annonces' : 'Posts Distribution'}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={filteredData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {filteredData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value) => [value, isFrenchlanguage ? 'Nombre d\'annonces' : 'Number of posts']}
                        labelFormatter={(label) => label}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

// Timeline Chart for Posts by Date
export const PostsTimelineChart = ({ posts }) => {
    const { language } = useContext(LanguageContext);
    const isFrenchlanguage = language === 'FR';

    // Group posts by date (using the createdAt field)
    const groupedByDate = posts.reduce((acc, post) => {
        // Skip posts without createdAt
        if (!post.moderated_at) {
            return acc;
        }

        let date;
        try {
            // Handle different possible formats of createdAt
            if (post.moderated_at.toDate && typeof post.moderated_at.toDate === 'function') {
                // Firestore Timestamp
                date = post.moderated_at.toDate();
            } else if (post.moderated_at._seconds) {
                // Firestore Timestamp converted to object
                date = new Date(post.moderated_at._seconds * 1000);
            } else if (typeof post.moderated_at === 'string') {
                // ISO string or other string format
                date = new Date(post.moderated_at);
            } else if (typeof post.moderated_at === 'number') {
                // Unix timestamp in milliseconds
                date = new Date(post.moderated_at);
            } else {
                // Try direct conversion
                date = new Date(post.moderated_at);
            }

            // Validate the date is valid before using it
            if (isNaN(date.getTime())) {
                console.warn('Invalid date for post:', post.id || 'unknown');
                return acc;
            }

            const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format

            if (!acc[dateStr]) {
                acc[dateStr] = 0;
            }
            acc[dateStr]++;
        } catch (error) {
            console.warn('Error processing date for post:', post.id || 'unknown', error);
        }

        return acc;
    }, {});

    // Convert to array format for Recharts
    const data = Object.entries(groupedByDate)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(-30); // Show only the last 30 days

    return (
        <div className="chart-container">
            <h3>{isFrenchlanguage ? 'Annonces par Date' : 'Posts by Date'}</h3>
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
                        formatter={(value) => [value, isFrenchlanguage ? 'Nombre d\'annonces' : 'Number of posts']}
                        labelFormatter={(dateStr) => {
                            const date = new Date(dateStr);
                            return date.toLocaleDateString(isFrenchlanguage ? 'fr-FR' : 'en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            });
                        }}
                    />
                    <Legend />
                    <Bar
                        dataKey="count"
                        name={isFrenchlanguage ? 'Nombre d\'annonces' : 'Number of posts'}
                        fill="#8884d8"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

// Category Distribution Chart
export const PostsCategoryChart = ({ posts }) => {
    const { language } = useContext(LanguageContext);
    const isFrenchlanguage = language === 'FR';

    // Group posts by category
    const groupedByCategory = posts.reduce((acc, post) => {
        const category = post.category || 'Uncategorized';

        if (!acc[category]) {
            acc[category] = 0;
        }
        acc[category]++;
        return acc;
    }, {});

    // Convert to array format for Recharts and sort by count
    const data = Object.entries(groupedByCategory)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);

    return (
        <div className="chart-container">
            <h3>{isFrenchlanguage ? 'Annonces par Catégorie' : 'Posts by Category'}</h3>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{
                        top: 5,
                        right: 30,
                        left: 100, // More space for category names
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                        dataKey="category"
                        type="category"
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                        formatter={(value) => [value, isFrenchlanguage ? 'Nombre d\'annonces' : 'Number of posts']}
                        labelFormatter={(label) => label}
                    />
                    <Legend />
                    <Bar
                        dataKey="count"
                        name={isFrenchlanguage ? 'Nombre d\'annonces' : 'Number of posts'}
                        fill="#82ca9d"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
