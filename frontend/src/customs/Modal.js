import React from 'react';
import '../styles/Modal.scss';

export default function Modal({ onShow, onHide, title, children, isNext, onNext, nextText }) {
    if (!onShow) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onHide}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h4 className="modal-title">{title}</h4>
                    <button className="close-button" onClick={onHide}>
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                <div className={`modal-footer ${isNext ? "space-between" : "flex-end"}`}>
                    {isNext ? (
                        <button className="modal-button next" onClick={onNext}>
                            {nextText}
                        </button>
                    ) : null}
                    <button className="modal-button close" onClick={onHide}>
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};