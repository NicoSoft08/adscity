import React, { useEffect, useState } from 'react';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchUserById } from '../../routes/userRoutes';
import Loading from '../../customs/Loading';
import UserCard from '../../components/card/UserCard';
import '../../styles/ManageUserID.scss';

export default function ManageUserID() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const { user_id } = useParams();
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/admin/dashboard/users');
    };

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchUserById(user_id);
            if (result.success) {
                setUser(result.data);
                setLoading(false);
            }
        };

        if (user_id) {
            fetchData();
        }
    }, [user_id]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className='manage-user'>
            <div className="head">
                <FontAwesomeIcon icon={faChevronLeft} title='Go Back' onClick={handleBack} />
                <h2>Utilisateur: {user_id.toLocaleUpperCase()}</h2>
            </div>

            <UserCard user={user} />
        </div>
    );
};
