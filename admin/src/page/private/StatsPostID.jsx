import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPostById } from '../../routes/postRoutes';
import Loading from '../../customs/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../contexts/AuthContext';
import { LanguageContext } from '../../contexts/LanguageContext';
import PostStatisticsCharts from '../../components/PostStatisticsCharts';

export default function StatsPostID() {
    const { post_id } = useParams();
    const { language } = useContext(LanguageContext);
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get the authentication token if user is logged in
                let idToken = null;
                if (currentUser) {
                    idToken = await currentUser.getIdToken(true);
                }

                const result = await fetchPostById(post_id, idToken);
                if (result.success) {
                    setPost(result.data);
                } else {
                    // Handle error from API
                    console.error("Error fetching post:", result.message);
                    // You might want to show an error message or redirect
                }
            } catch (error) {
                console.error("Error in fetchData:", error);
                // Handle unexpected errors
            } finally {
                setLoading(false);
            }
        };

        if (post_id) {
            fetchData();
        }
    }, [post_id, currentUser]); // Add currentUser as a dependency

    
    const handleBack = () => {
        navigate(`/admin/dashboard/posts/${post_id}`);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className='manage-post'>
            <div className="head">
                <div className="back">
                    <FontAwesomeIcon icon={faChevronLeft} title='Go Back' onClick={handleBack} />
                </div>
                <div className="title">
                    <h2>{language === 'FR' ? "Annonces" : "Ads"} /</h2>
                    <p>{post?.details.title}</p>
                </div>
            </div>

            <PostStatisticsCharts post={post} />
        </div>
    );
};
