import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/Badge.scss';


export default function Badge({ count, icon, top, right, width, height }) {
    return (
        <div className='badge-container'>
            <FontAwesomeIcon icon={icon} className='bell' />
            {count === 0 ?
                null
                :
                <div
                    className='badge'
                    style={{ top: top, right: right, width: width, height: height }}
                >
                    <span>{count}</span>
                </div>
            }
        </div>
    );
};
