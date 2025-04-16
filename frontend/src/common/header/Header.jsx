import React, { useContext } from 'react';
import AppLogo from '../../utils/app-logo/AppLogo';
import { letterBlueBgWhite } from '../../config/logos';
import SearchBar from '../../components/search-bar/SearchBar';
import NavLinks from '../../components/nav-links/NavLinks';
import CreateAdButton from '../../components/create-ad-button/CreateAdButton';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import data from '../../json/data.json';
import './Header.scss';

export default function Header() {
    const { currentUser, userRole } = useContext(AuthContext);

    const renderCategoryImage = (categoryImage) => {
        return require(`../../imgs/cats/${categoryImage}`);
    };

    return (
        <header className='header'>
            <div className="content">
                {(!currentUser || userRole !== 'user') && (
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
                    {data.categories.map(({ key, categoryId, categoryTitles, categoryName, categoryImage }) => (
                        <div key={key} id={categoryId} className="sub-header-item">
                            <Link to={`/category/${categoryName}`}>
                                <img src={renderCategoryImage(categoryImage)} alt={categoryName} />
                                <span>{categoryTitles.fr}</span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </header>
    )
}
