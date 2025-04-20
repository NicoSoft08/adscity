import React, { useEffect, useState } from 'react';
import { getStatus } from '../../services/statusService';
import StatusItem from '../../utils/StatusItem';

export default function Status() {
    const [statuses, setStatuses] = useState([]);
    const windowWidth = window.innerWidth;
    const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
    const numVisibleEclipse = windowWidth < 576 ? statuses.length : 8;

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const status = await getStatus();
                if (status) {
                    setStatuses(status);
                }
            } catch (error) {
                console.error('Erreur pendant la collecte des données: ', error);
            }
        }

        fetchStatuses();
    }, []);

    return (
        <div className='status-component'>
            <div className='status-wrap'>
                {statuses.slice(currentStatusIndex, currentStatusIndex + numVisibleEclipse).map((item) => (
                    <StatusItem
                        id={item.id}
                        media={item.media}
                        isViewed={item.isViewed}
                        {...item}
                        handleStatusClick={() => setCurrentStatusIndex(currentStatusIndex)}
                    />
                ))}
            </div>
        </div>
    );
};
