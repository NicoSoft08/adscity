import React from 'react';
import './AppLogo.css';

export default function AppLogo({ source }) {
    return (
        <div className='app-logo' title='AdsCity'>
            <div className="logo">
                <img src={source} alt="adscity" />
            </div>
        </div>
    );
};
