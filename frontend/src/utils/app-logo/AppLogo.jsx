import React from 'react';
import './AppLogo.css';
import { Link } from 'react-router-dom';

export default function AppLogo({ source }) {
    return (
        <Link to='/' className='app-logo' title='AdsCity'>
            <div className="logo">
                <img src={source} alt="adscity" />
            </div>
        </Link>
    );
};
