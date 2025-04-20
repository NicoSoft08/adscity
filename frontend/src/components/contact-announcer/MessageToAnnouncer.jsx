import React, { useState } from 'react';
import Toast from '../../customs/Toast';
import Spinner from '../../customs/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './MessageToAnnouncer.scss';

const predefinedMessages = [
    "Bonjour, votre annonce m'intéresse. Est-elle toujours disponible ?",
    "Pouvez-vous me donner plus de détails sur l'annonce ?",
    "Est-il possible de négocier le prix ?",
    "Où et quand puis-je voir l'article en personne ?",
];

export default function MessageToAnnouncer({ announcerID, currentUser, onSendMessage }) {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    const handleSendMessage = async () => {
        if (!currentUser) {
            setToast({
                show: true,
                type: 'error',
                message: "Oups !!! Il semble que vous n'êtes pas connecté."
            });
            return;
        }

        if (!message.trim()) {
            setToast({
                show: true,
                type: 'error',
                message: 'Vous devez entrer un message'
            });
            return;
        };

        setToast({
            show: true,
            type: 'warning',
            message: 'Cette fonctionnalité n\'est pas encore disponible.'
        });
        return;

        // setLoading(true);
        // try {
        //     // Envoi du message (via une fonction onSendMessage passée en prop ou via Firestore)
        //     await onSendMessage({ senderID: currentUser?.uid, receiverID: announcerID, text: message });

        //     setMessage(""); // Réinitialiser le champ après l'envoi
        // } catch (error) {
        //     console.error("Erreur d'envoi du message:", error);
        // }
        // setLoading(false);
    };

    return (
        <div className="message-to-advertiser">
            <label htmlFor="message-textarea">✉️ Écrire à l'annonceur :</label>
            
            <div className="predefined-messages">
                {predefinedMessages.map((msg, index) => (
                    <button key={index} onClick={() => setMessage(msg)}>
                        {msg}
                    </button>
                ))}
            </div>

            <textarea
                id="message-textarea"
                placeholder="Tapez votre message ici..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="4"
            ></textarea>
            <button onClick={handleSendMessage} disabled={loading || !message.trim()}>
                {loading ? <Spinner /> : <FontAwesomeIcon icon={faPaperPlane} />}
            </button>

            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
};
