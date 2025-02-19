import React, { useEffect, useState } from 'react';
import UsersStatistics from './UsersStatistics';
import { fetchPendingPosts } from '../../routes/postRoutes';
import PaymentStats from '../../components/payment-stats/PaymentStats';
import PostsStatistics from './PostsStatistics';
import PendingPosts from './PendingPosts';
import AdminPostsChart from './AdminPostsChart';
import Pagination from '../../components/pagination/Pagination';
import '../../styles/DashboardPanel.scss';

export default function DashboardPanel() {
    const [postsPending, setPostsPending] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pendingPostPerPage] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchPendingPosts();
            if (result.success) {
                setPostsPending(result.pendingPosts);
            }
        };

        fetchData();
    }, []);

    // Get current users
    const indexOfLastUser = currentPage * pendingPostPerPage;
    const indexOfFirstUser = indexOfLastUser - pendingPostPerPage;
    const currentPendingPosts = postsPending.slice(indexOfFirstUser, indexOfLastUser);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);


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
            <Pagination
                currentPage={currentPage}
                elements={currentPendingPosts}
                elementsPerPage={pendingPostPerPage}
                paginate={paginate}
            />
        </div>
    );
};
