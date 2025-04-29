import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import PubCreationForm from '../../hooks/host-publicity/PubCreationForm';
import '../../hooks/host-publicity/PubCreationForm.scss';


export default function PubCreationPage() {
    const { currentUser, userData } = useContext(AuthContext);

    return (
        <div className='create-advertising-container'>
            <PubCreationForm currentUser={currentUser} userData={userData} />
        </div>
    );
};
