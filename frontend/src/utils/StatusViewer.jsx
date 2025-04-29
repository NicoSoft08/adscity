import React, { useEffect, useRef, useState } from 'react';
import { faChevronLeft, faChevronRight, faEye, faTimes, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { IconAvatar } from '../config/images';
import '../styles/StatusViewer.scss';

export default function StatusViewer({
    statuses,
    initialStatusId,
    currentUserID,
    onClose,
    markStatusAsViewed
}) {
    // Trouver l'index du statut initial
    const initialIndex = statuses.findIndex(status => status.statusID === initialStatusId);
    const [currentIndex, setCurrentIndex] = useState(initialIndex !== -1 ? initialIndex : 0);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const progressTimerRef = useRef(null);
    const statusDuration = 10000; // 10 seconds per status
    const progressInterval = 100; // Update progress every 100ms

    const currentStatus = statuses[currentIndex];
    const currentUser = currentStatus?.userData;
    const displayName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Utilisateur';
    const profilURL = currentUser && currentUser?.profilURL;
    const isCurrentUser = currentStatus?.userID === currentUserID;

    // Mark status as viewed when opened
    useEffect(() => {
        const markAsViewed = async () => {
            if (!isCurrentUser && currentStatus) {
                await markStatusAsViewed(currentStatus.statusID, currentUserID);
            }
        };
        markAsViewed();
    }, [currentStatus, currentUserID, isCurrentUser, markStatusAsViewed]);

    // Handle progress bar and auto-navigation
    useEffect(() => {
        if (isPaused) return;
        // Reset progress when changing status
        setProgress(0);
        // Clear any existing timer
        if (progressTimerRef.current) {
            clearInterval(progressTimerRef.current);
        }
        // Set up progress timer
        progressTimerRef.current = setInterval(() => {
            setProgress(prevProgress => {
                const newProgress = prevProgress + (progressInterval / statusDuration) * 100;
                // Move to next status when progress reaches 100%
                if (newProgress >= 100) {
                    clearInterval(progressTimerRef.current);
                    // If there are more statuses, move to the next one
                    if (currentIndex < statuses.length - 1) {
                        setCurrentIndex(prevIndex => prevIndex + 1);
                    } else {
                        // Close the viewer if we're at the last status
                        setTimeout(() => onClose(), 1000);
                    }
                }
                return newProgress < 100 ? newProgress : 100;
            });
        }, progressInterval);
        // Clean up timer on unmount
        return () => {
            if (progressTimerRef.current) {
                clearInterval(progressTimerRef.current);
            }
        };
    }, [currentIndex, statuses.length, onClose, isPaused]);

    // Handle navigation between statuses
    const handleNavigation = (direction) => {
        if (direction === 'prev' && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else if (direction === 'next' && currentIndex < statuses.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    // Toggle pause/play
    const togglePause = () => {
        setIsPaused(!isPaused);
    };

    // Pause progress when user interacts with the status
    const handleMouseDown = () => setIsPaused(true);
    const handleMouseUp = () => setIsPaused(false);

    // Format the timestamp
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';

        // Handle different timestamp formats
        const date = timestamp._seconds
            ? new Date(timestamp._seconds * 1000)
            : timestamp.seconds
                ? new Date(timestamp.seconds * 1000)
                : new Date(timestamp);

        return formatDistanceToNow(date, { addSuffix: true, locale: fr });
    };

    // Render the status content based on its type
    const renderStatusContent = () => {
        if (!currentStatus) return null;

        // Handle different content structures
        const content = currentStatus.content || {};
        const text = content.text || currentStatus.text || '';
        const mediaURL = content.mediaURL || currentStatus.mediaURL || '';
        const fontStyle = currentStatus.fontStyle || 'default';
        const backgroundColor = currentStatus.backgroundColor || '#4CAF50';

        switch (currentStatus.type) {
            case 'text':
                return (
                    <div
                        className={`text-status ${fontStyle}`}
                        style={{ backgroundColor }}
                    >
                        <p>{text}</p>
                    </div>
                );
            case 'image':
                return (
                    <div className="image-status">
                        <img src={mediaURL} alt="Status" />
                        {text && (
                            <div className="status-caption">
                                <p>{text}</p>
                            </div>
                        )}
                    </div>
                );
            case 'video':
                return (
                    <div className="video-status">
                        <video
                            src={mediaURL}
                            controls={false}
                            autoPlay={true}
                            onPlay={() => setIsPaused(true)}
                            onPause={() => setIsPaused(false)}
                            onEnded={() => {
                                setIsPaused(false);
                                setProgress(100); // Force progress to complete
                            }}
                        />
                        {text && (
                            <div className="status-caption">
                                <p>{text}</p>
                            </div>
                        )}
                    </div>
                );
            default:
                return <div className="error-status">Contenu non disponible</div>;
        }
    };

    // Si aucun statut n'est trouvé, ne rien afficher
    if (!currentStatus) {
        return null;
    }

    return (
        <div
            className="status-viewer-overlay"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
        >
            <div className="status-viewer">
                {/* Close button */}
                <button className="close-button" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>

                {/* Status header */}
                <div className="status-header">
                    <div className="user-info">
                        <img
                            src={isCurrentUser ? profilURL : IconAvatar}
                            alt={isCurrentUser ? 'Mon statut' : displayName}
                            className="user-avatar"
                        />
                        <div className="user-details">
                            <h3>
                            {isCurrentUser ? 'Mon statut' : displayName}
                            </h3>
                            <span>{formatTimestamp(currentStatus?.createdAt)}</span>
                        </div>
                    </div>

                    {/* Pause/Play button */}
                    <button className="pause-button" onClick={togglePause}>
                        <FontAwesomeIcon icon={isPaused ? faPlay : faPause} />
                    </button>
                </div>

                {/* Progress bars */}
                <div className="progress-bar-container">
                    {statuses.map((_, index) => (
                        <div
                            key={index}
                            className={`progressive-bar ${index === currentIndex ? 'active' : index < currentIndex ? 'completed' : ''}`}
                        >
                            <div
                                className="progress-fill"
                                style={{ width: index === currentIndex ? `${progress}%` : index < currentIndex ? '100%' : '0%' }}
                            ></div>
                        </div>
                    ))}
                </div>

                {/* Status content */}
                <div className="status-content">
                    {renderStatusContent()}
                </div>

                {/* Navigation buttons */}
                {currentIndex > 0 && (
                    <button
                        className="nav-button prev-button"
                        onClick={() => handleNavigation('prev')}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                )}
                {currentIndex < statuses.length - 1 && (
                    <button
                        className="nav-button next-button"
                        onClick={() => handleNavigation('next')}
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                )}

                {/* View count */}
                {isCurrentUser && currentStatus?.viewCount > 0 && (
                    <div className="view-count">
                        <FontAwesomeIcon icon={faEye} />
                        <span>{currentStatus.viewCount}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
