import React from 'react';
import CreateAdFlow from '../../hooks/create-ad-flow/CreateAdFlow';
import '../../styles/CreateAdPage.scss';

export default function CreateAdPage() {
    return (
        <div className='create-ad-page'>
            <div className="container">
                <CreateAdFlow />
            </div>
        </div>
    );
};
