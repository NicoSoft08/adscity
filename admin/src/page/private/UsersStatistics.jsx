import React, { useEffect, useState } from 'react';
import {
    fetchUsers,
} from '../../routes/userRoutes';
import '../../styles/UsersStatistics.scss';
import { Bar } from 'react-chartjs-2';

export default function UsersStatistics() {
    const [users, setUsers] = useState([]);
    const [online, setOnline] = useState([]);
    const [offline, setOffline] = useState([]);


    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const data = await fetchUsers();
                if (isMounted && data) {
                    setUsers(data.users?.allUsers);
                    setOnline(data.users?.onlineUsers);
                    setOffline(data.users?.offlineUsers);
                }
            } catch (err) {
                console.error('Erreur technique:', err);
            }
        };

        fetchData();

        return () => { isMounted = false; };
    }, []);

    const data = {
        labels: ["Tous", "Online", "Offline"],
        datasets: [
            {
                label: "Statut des utilisateurs",
                data: [users.length, online.length, offline.length],
                backgroundColor: ["#00aaff", "#4CAF50", "#FF0000"],
            },
        ],
    };

    return (
        <div className='users-stats'>

            <div className="chart-container">
                <h4>État des annonces</h4>
                <Bar data={data} />
            </div>

        </div>
    );
};
