import React, { useEffect, useState } from 'react';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    fetchAllUsers, 
    fetchOfflineUsers, 
    fetchOnlineUsers 
} from '../../services/userServices';
import '../../styles/UsersStatistics.scss';

export default function UsersStatistics() {
    const [users, setUsers] = useState([]);
    const [usersOnline, setUsersOnline] = useState([]);
    const [usersOffline, setUsersOffline] = useState([]);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Fetch all the users data in parallel
                const [allUsers, onlineUsers, offlineUsers] = await Promise.all([
                    fetchAllUsers(),
                    fetchOnlineUsers(),
                    fetchOfflineUsers(),
                ]);

                // Set the users data
                setUsers(allUsers);
                setUsersOnline(onlineUsers);
                setUsersOffline(offlineUsers);
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
            }
        }

        fetchAllData();
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
                        <p>{usersOnline.length}</p>
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
                        <p>{usersOffline.length}</p>
                        <sub>{"pers."}</sub>
                    </div>
                </div>
            </div>
        </div>
    );
};
