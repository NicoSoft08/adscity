import React from 'react';
import './Header.scss';

import AppLogo from '../../utils/app-logo/AppLogo';
import { logos } from '../../config';
import SearchBar from '../../components/search-bar/SearchBar';
import NavLinks from '../../components/nav-links/NavLinks';
import CreateAdButton from '../../components/create-ad-button/CreateAdButton';
import { allCategories } from '../../data/database';
import { Link } from 'react-router-dom';

export default function Header() {

    return (
        <header className='header'>
            <div className="content">
                <div className="top-header">
                    <div className="__left">
                        <Link to="/help-center"><span>Aide</span></Link>
                    </div>
                    <div className="__right">
                        <Link to="/auth/signin"><span>Connexion</span></Link>
                        <Link to="/auth/create-user"><span>Inscription</span></Link>
                    </div>
                </div>
                <div className="main-header">
                    <div className="__left">
                        <AppLogo source={logos.letterBlueBgWhite} />
                    </div>
                    <div className="__middle">
                        <SearchBar />
                    </div>
                    <div className="__right">
                        <NavLinks />
                        <CreateAdButton />
                    </div>
                </div>
                <div className="sub-header">
                    {allCategories.map((item) => (
                        <div key={item.key} className="sub-header-item">
                            <Link to={`/category/${item.categoryName}`}>
                                <img src={item.categoryImage} alt="" />
                                <span>{item.categoryTitles.fr}</span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </header>
    )
}
