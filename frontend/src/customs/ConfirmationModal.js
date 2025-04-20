import React from 'react';
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../styles/ConfirmationModal.scss';

const ConfirmationModal = ({
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
    onCancel
}) => {
    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="close-button" onClick={onCancel}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                <div className="modal-footer">
                    <button className="cancel-button" onClick={onCancel}>
                        {cancelText || "Annuler"}
                    </button>
                    <button className="confirm-button" onClick={onConfirm}>
                        {confirmText || "Confirmer"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;