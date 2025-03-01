import React, { useContext } from 'react';
import AppLogo from '../../utils/app-logo/AppLogo';
import { letterBlueBgWhite } from '../../config/logos';
import SearchBar from '../../components/search-bar/SearchBar';
import NavLinks from '../../components/nav-links/NavLinks';
import CreateAdButton from '../../components/create-ad-button/CreateAdButton';
import { allCategories } from '../../data/database';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './Header.scss';

export default function Header() {
    const { currentUser, userRole } = useContext(AuthContext);
    return (
        <header className='header'>
            <div className="content">
                {currentUser ? null : (
                    <div className="top-header">
                        <div className="__left">
                            <Link to="/help-center"><span>Aide</span></Link>
                        </div>
                        <div className="__right">
                            <Link to="/auth/signin"><span>Connexion</span></Link>
                            <Link to="/auth/create-user"><span>Inscription</span></Link>
                        </div>
                    </div>
                )}
                <div className="main-header">
                    <div className="__left">
                        <AppLogo source={letterBlueBgWhite} />
                    </div>
                    <div className="__middle">
                        <SearchBar currentUser={currentUser} />
                    </div>
                    <div className="__right">
                        <NavLinks />
                        <CreateAdButton currentUser={currentUser} userRole={userRole} />
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
