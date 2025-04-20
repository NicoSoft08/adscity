import React from 'react';
import './SideBar.scss';

export default function SideBar({ items, selectedId, onItemClick }) {
    return (
        <div className="sidebar">
            {items.map(item => (
                <div
                    title={item.name}
                    key={item.id}
                    className={`sidebar-item ${selectedId === item.selectId ? 'active' : ''}`}
                    onClick={() => onItemClick(item.selectId)}
                >
                    <item.icon style={{ marginRight: '8px' }} />
                    <span>{item.name}</span>
                </div>
            ))}
        </div>
    );
};
