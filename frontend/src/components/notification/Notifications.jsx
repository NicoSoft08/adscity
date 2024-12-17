import React from 'react';
import AdscityBadge from '../../utils/adscity-badge/AdscityBadge';
import { logos } from '../../config';
import { formatDistanceToNowStrict } from 'date-fns';
import { fr } from 'date-fns/locale'
import './Notifications.scss';


const NotificationCard = ({ notification }) => {
    return (
        <div className="notification-item">
            <h4>{notification?.title}</h4>
            <p>{notification?.message}</p>
            <small>{formatDistanceToNowStrict(notification?.time, { locale: fr })}</small>
        </div>
    );
};

export default function Notifications({ notifications }) {

    return (
        <div className='notification'>

            <AdscityBadge
                logoURL={logos.letterWhiteBgBlue}
                name={"AdsCity"}
                isVerified={true}
            />
            {notifications.map((index, notification) => (
                <NotificationCard
                    key={index}
                    notification={notification}
                    
                />
            ))}
        </div>
    );
};
