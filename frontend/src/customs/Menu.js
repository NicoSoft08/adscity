import React, { useEffect, useRef } from 'react';
import { faEyeSlash, faFlag, faShare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/Menu.scss';

export default function Menu({ ad, onClose, isOpen, onReport, onShare, onHide }) {
    const menuRef = useRef(null);

    const options = [
        {
            label: 'Signaler l\'annonce',
            icon: faFlag,
            action: () => onReport(ad.id)
        },
        {
            label: 'Partager',
            icon: faShare,
            action: () => onShare(ad.id)
        },
        {
            label: 'Masquer',
            icon: faEyeSlash,
            action: () => onHide(ad.id)
        },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    if (!isOpen) return null;


    return (
        <div className="menu" ref={menuRef}>
            {options.map((option, index) => (
                <div key={index} className="menu-item" onClick={option.action}>
                    <FontAwesomeIcon icon={option.icon} />
                    <span>{option.label}</span>
                </div>
            ))}
        </div>
    )
}
