import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/Menu.scss';

export default function Menu({ onClose, isOpen, options }) {
    const menuRef = useRef(null);


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
