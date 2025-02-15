import React, { useEffect, useState } from 'react';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    fetchAllUsersWithStatus, 
} from '../../routes/userRoutes';
import '../../styles/UsersStatistics.scss';

export default function UsersStatistics() {
    const [users, setUsers] = useState([]);
    const [online, setOnline] = useState([]);
    const [offline, setOffline] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchAllUsersWithStatus();
                setUsers(data.allUsers);
                setOnline(data.onlineUsers);
                setOffline(data.offlineUsers);
            } catch (err) {
                console.error('Erreur technique:', err);
            }
        };
    
        fetchData();
    }, []);

    return (
        <div className='users-stats'>
            <div className="body">

                <div className="box-detail">
                    <div className="_header">
                        <div className="dot-detail all">
                            <FontAwesomeIcon icon={faUsers} />
                        </div>
                        <h3 className='title'>Tous</h3>
                    </div>
                    <div className="detail">
                        <p>{users.length}</p>
                        <sub>{"pers."}</sub>
                    </div>
                </div>

                <div className="box-detail">
                    <div className="_header">
                        <div className="dot-detail online">
                            <FontAwesomeIcon icon={faUsers} />
                        </div>
                        <h3 className='title'>Online</h3>
                    </div>
                    <div className="detail">
                        <p>{online.length}</p>
                        <sub>{"pers."}</sub>
                    </div>
                </div>

                <div className="box-detail">
                    <div className="_header">
                        <div className="dot-detail offline">
                            <FontAwesomeIcon icon={faUsers} />
                        </div>
                        <h3 className='title'>Offline</h3>
                    </div>
                    <div className="detail">
                        <p>{offline.length}</p>
                        <sub>{"pers."}</sub>
                    </div>
                </div>
            </div>
        </div>
    );
};
