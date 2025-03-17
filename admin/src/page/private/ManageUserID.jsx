import React, { useEffect, useRef, useState } from 'react';
import { faChartSimple, faChevronLeft, faEllipsisH, faPauseCircle, faTrash, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchUserById } from '../../routes/userRoutes';
import Loading from '../../customs/Loading';
import UserCard from '../../components/card/UserCard';
import '../../styles/ManageUserID.scss';

export default function ManageUserID() {
    const menuRef = useRef(null);
    const { user_id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [showMenu, setShowMenu] = useState(false);

    const handleBack = () => {
        navigate('/admin/dashboard/users');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    const handleMenuClick = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    const options = [
        {
            label: 'Suspendre',
            icon: faPauseCircle, // Icône pour suspendre
            action: () => handleSuspend(user?.userID)
        },
        {
            label: 'Activités',
            icon: faChartSimple,
            action: () => navigate('activity')
        },
        {
            label: 'Restaurer',
            icon: faUndo, // Icône pour restaurer
            action: () => handleRestore(user?.userID)
        },
        {
            label: 'Supprimer',
            icon: faTrash,
            action: () => handleDelete(user?.userID) // Assure-toi d'utiliser PostID
        },
    ];

    const handleDelete = () => {};

    const handleSuspend = () => {};

    const handleRestore = () => {};

    if (loading) {
        return <Loading />;
    }

    return (
        <div className='manage-user'>
            <div className="head">
                <FontAwesomeIcon icon={faChevronLeft} title='Go Back' onClick={handleBack} />
                <h2>Utilisateur: {user_id.toLocaleUpperCase()}</h2>

                <span className="more-options" title="Plus d'options" onClick={handleMenuClick}>
                    <FontAwesomeIcon icon={faEllipsisH} />
                </span>
                {showMenu &&
                    <div className="options-menu" ref={menuRef}>
                        {options.map((option, index) => (
                            <div key={index} className="options-menu-item" onClick={option.action}>
                                <FontAwesomeIcon icon={option.icon} />
                                <span>{option.label}</span>
                            </div>
                        ))}
                    </div>
                }
            </div>

            <UserCard user={user} />
        </div>
    );
};
