import React, { useEffect, useState } from 'react';
import UsersStatistics from './UsersStatistics';
import { fetchPendingPosts } from '../../routes/postRoutes';
import PaymentStats from '../../components/payment-stats/PaymentStats';
import PostsStatistics from './PostsStatistics';
import PendingPosts from './PendingPosts';
import AdminPostsChart from './AdminPostsChart';
import '../../styles/DashboardPanel.scss';

export default function DashboardPanel() {
    const [postsPending, setPostsPending] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchPendingPosts();
            if (result.success) {
                setPostsPending(result.pendingPosts);
            }
        };

        fetchData();
    }, []);


    return (
        <div className='panel'>
            <h2>Tableau de bord</h2>
            <div className='panel-body'>
                <div className='panel-left'>
                    <PostsStatistics />
                    <UsersStatistics />

                </div>
                <AdminPostsChart />
            </div>
            <PaymentStats />
            <PendingPosts pendingPosts={postsPending} />
        </div>
    );
};
