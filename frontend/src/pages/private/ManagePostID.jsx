import React, { useEffect, useState } from 'react';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../customs/Loading';
import { fetchPostById } from '../../routes/postRoutes';
import PostCard from '../../components/card/PostCard';
import '../../styles/ManagePostID.scss';

export default function ManagePostID({ currentUser }) {
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState(null);
    const { post_id } = useParams();
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/user/dashboard/posts');
    };

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchPostById(post_id);
            if (result.success) {
                setPost(result.data);
                setLoading(false);
            }
        };

        if (post_id) {
            fetchData();
        }
    }, [post_id]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className='manage-post'>
            <div className="head">
                <FontAwesomeIcon icon={faChevronLeft} title='Go Back' onClick={handleBack} />
                <h2>Annonce: {post_id.toLocaleUpperCase()}</h2>
            </div>
            <PostCard currentUser={currentUser} post={post} />
        </div>
    );
};
