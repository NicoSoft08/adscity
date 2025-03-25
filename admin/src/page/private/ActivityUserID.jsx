import React, { useEffect, useState } from 'react';
import { differenceInDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserIDLoginActivity } from '../../routes/userRoutes';
import '../../styles/ActivityUserID.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

export default function ActivityUserID() {
    const { user_id } = useParams();
    const navigate = useNavigate();
    const [loginActivity, setLoginActivity] = useState([]);

    useEffect(() => {
        // if (!user_id) return;

        const fetchUserActivity = async () => {
            const result = await getUserIDLoginActivity(user_id);
            if (result.success) {
                setLoginActivity(result.activity);
            }
        };

        fetchUserActivity();
    }, [user_id]);

    const formatDateTimestamp = (adTimestamp) => {
        if (!adTimestamp) return "Date inconnue";

        const adDate = new Date(adTimestamp?._seconds * 1000);
        const now = new Date();
        const diffDays = differenceInDays(now, adDate);

        if (diffDays === 0) return `Auj. à ${format(adDate, 'HH:mm', { locale: fr })}`;
        if (diffDays === 1) return `Hier à ${format(adDate, 'HH:mm', { locale: fr })}`;
        if (diffDays === 2) return `Avant-hier à ${format(adDate, 'HH:mm', { locale: fr })}`;

        return `${format(adDate, 'dd/MM/yyyy à HH:mm', { locale: fr })}`;
    };

    const handleBack = () => {
        navigate('/admin/dashboard/users');
    };

    return (
        <div className='activity'>
            <div className="head">
                <FontAwesomeIcon icon={faChevronLeft} title='Go Back' onClick={handleBack} />
                <h2>Activité de Connexion</h2>
            </div>
            <p>
                {loginActivity.length === 0
                    ? "Aucune activité récente."
                    : `Voici votre journal ${loginActivity.length > 1
                        ? `${loginActivity.length} dernières activités`
                        : "dernière activité"
                    } de connexion.`}
            </p>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Navigateur</th>
                            <th>Système</th>
                            <th>Adresse IP</th>
                            <th>Période</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loginActivity.map((activity, index) => (
                            <tr key={index}>
                                <td>{activity.deviceInfo.browser}</td>
                                <td>{activity.deviceInfo.os}</td>
                                <td>{activity.deviceInfo.ip}</td>
                                <td>{formatDateTimestamp(activity.time)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
