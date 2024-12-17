import React from 'react';

const styles = {
    coverLeft: {
        width: '90%',
        padding: '10px',
        height: '100%',
        backgroundColor: '#6698cd',
    },
    coverRight: {
        padding: '10px',
        // width: '100%',
        height: '100%',
        backgroundColor: '#ff6162',
    },
}

const SideBarLeft = ({ children }) => {
    return (
        <div style={styles.coverLeft}>
            {children}
        </div>
    );
};


const SideBarRight = ({ children }) => {
    return (
        <div style={styles.coverRight}>
            {children}
        </div>
    );
};


export { SideBarLeft, SideBarRight };
