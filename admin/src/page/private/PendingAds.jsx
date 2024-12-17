import React, { useState } from 'react';
import { onApproveAd, onRefuseAd } from '../../services/adServices';
import { formateDateTimestamp } from '../../func';
import Modal from '../../customs/Modal';
import Tab from '../../customs/Tab';
import '../../styles/PendingAds.scss';

export default function PendingAds({ pendingAds }) {
    const [isOpen, setIsOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [refusalReason, setRefusalReason] = useState('');
    const [selectedAdID, setSelectedAdID] = useState(null);

    // const defaultReason = "En vertu des Règles De Publication qui régissent le fonctionnement d'AdsCity et au regard des photos sélectionnées pour votre annonce, il est à noter que les photos ne sont pas en adéquation avec le titre de l'annonce.";

    const handleDetailClick = (adID) => {
        setSelectedAdID(adID);
        setDetailOpen(true);
    }

    const handleOpenModal = (adID) => {
        setSelectedAdID(adID);
        setIsOpen(true);
    }

    const handleCloseModal = () => {
        setIsOpen(false);
        setConfirm(false);
    }


    const handleApprove = async (adID) => {
        const result = await onApproveAd(adID);

        if (result) {
            console.log('Annonce approuvée avec succès', result.message);
        } else {
            console.log('Erreur lors de l\'approbation de l\'annonce:', result.error);
        }
    };


    const handleReject = async () => {
        if (!selectedAdID) return;

        if (refusalReason.trim() === '') {
            setMessage({ type: 'error', text: 'Veuillez fournir un motif avant de refuser l\'annonce.' });
            return;
        }

        handleCloseModal();

        const result = await onRefuseAd(selectedAdID, refusalReason);

        if (result) {
            setMessage({ type: 'success', text: 'Annonce refusée avec succès.' });
            console.log('Annonce refusée avec succès', result.message);
        } else {
            setMessage({ type: 'error', text: result.error || 'Erreur lors du refus de l\'annonce.' });
            console.error('Erreur lors du refus de l\'annonce', result.error);
        }
    };

    return (
        <div className='pending-ads'>
            <h3>Annonces en attente</h3>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Photo</th>
                        <th>Titre</th>
                        <th>Description</th>
                        <th>Catégorie</th>
                        <th>Ville</th>
                        <th>Région</th>
                        <th>Date de Publication</th>
                        <th>Prix</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        pendingAds.length > 0 ? (
                            pendingAds.map((ad, index) => (
                                <tr key={ad.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <img src={ad.images[0]} alt='' width={50} height={50} />
                                    </td>
                                    <td>{ad.adDetails.title}</td>
                                    <td>{ad.adDetails.description}</td>
                                    <td>{ad.category}</td>
                                    <td>{ad.location.city}</td>
                                    <td>{ad.location.country}</td>
                                    <td>{formateDateTimestamp(ad.posted_at._seconds)}</td>
                                    <td>{ad.adDetails.price} {ad.adDetails.currency} </td>
                                    <td>
                                        <button
                                            className='see-more'
                                            onClick={() => handleDetailClick(ad.id)}
                                        >
                                            Détails
                                        </button>
                                    </td>
                                    {/* <td>
                                        <button
                                            onClick={() => handleApprove(ad.id)}
                                            className="approve-button"
                                            title='Approuver'
                                        >
                                            <FontAwesomeIcon icon={faCheck} />
                                        </button>
                                        <button
                                            onClick={() => handleOpenModal((ad.id))}
                                            className="reject-button"
                                            title='Refuser'
                                        >
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    </td> */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" align='center'>Chargement des annonces en attente d'approbation.</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>

            {isOpen && (
                <Modal
                    title={"Confirmation requise"}
                    onShow={handleOpenModal}
                    onHide={handleCloseModal}
                    isNext={true}
                    nextText={'Confirmer'}
                    hideText={"Annuler"}
                    onNext={() => {
                        if (confirm) {
                            handleReject();
                        } else {
                            setConfirm(true);  // Passer à la phase de confirmation
                        }
                    }}
                >
                    {confirm ? (
                        <>
                            <p>
                                Êtes-vous certain de vouloir refuser cette annonce ?
                                Cette action est définitive et ne pourra pas être annulée.
                                Une fois refusée, l'annonce ne pourra plus être modifiée ou restaurée.
                            </p>
                            {message.type === 'error' && <p className='error-text'>{message.text}</p>}
                        </>
                    ) : (
                        <>
                            <label htmlFor="report_reason">
                                Motif du refus
                                <textarea
                                    name='report_reason'
                                    value={refusalReason}
                                    rows={5}
                                    onChange={(e) => setRefusalReason(e.target.value)}
                                />
                            </label>
                        </>
                    )}
                </Modal>
            )}

            {detailOpen && (
                <Modal
                    title={"Détails de l'annonce"}
                    onShow={handleDetailClick}
                    onHide={() => setDetailOpen(false)}
                    isNext={false}
                    isHide={false}
                >
                    <div className='ad-details'>
                        {pendingAds.map(pendingAd => (
                            <>
                                <Tab
                                    pendingAd={pendingAd}
                                    key={pendingAd.id}
                                />
                                <div className="ad-details-buttons">
                                    <button
                                        className="modal-button approve-button"
                                        onClick={() => {
                                            setDetailOpen(false);
                                            handleApprove(pendingAd.id);
                                        }}
                                    >
                                        Approuver
                                    </button>
                                    <button
                                        className="modal-button reject-button"
                                        onClick={() => {
                                            setDetailOpen(false);
                                            handleOpenModal((pendingAd.id))
                                        }}
                                    >
                                        Refuser
                                    </button>
                                </div>
                            </>
                        ))}
                    </div>
                </Modal>
            )}
        </div>
    );
};
