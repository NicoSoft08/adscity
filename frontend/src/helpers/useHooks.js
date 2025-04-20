import { useCallback } from "react";

const useBusinessPostActions = (post, setShowMenu, setShowReportModal) => {
    const handleClosePost = useCallback(() => {
        console.log(`Fermeture de l'annonce ${post.id}`);
        setShowMenu(false);
    }, [post, setShowMenu]);

    const handleReportPost = useCallback(() => {
        setShowReportModal(true);
        setShowMenu(false);
        console.log(`Signaler l'annonce avec l'ID : ${post.id}`);
    }, [post, setShowMenu, setShowReportModal]);

    const handleShareAd = useCallback(() => {
        console.log(`Publicité partagée sur AdsCity pour l'annonce ${post.id}`);
        setShowMenu(false);
    }, [post, setShowMenu]);

    const handleCopyLink = useCallback(() => {
        navigator.clipboard.writeText(post.targetURL)
            .then(() => console.log(`Lien copié pour l'annonce ${post.id}`))
            .catch((err) => console.error("Erreur lors de la copie du lien :", err));
        setShowMenu(false);
    }, [post, setShowMenu]);

    const handleReportWithReason = useCallback((reason) => {
        console.log(`Signalement de l'annonce ${post.id} avec la raison : ${reason}`);
        setShowReportModal(false);
        setShowMenu(false);
    }, [post, setShowMenu, setShowReportModal]);

    return { handleClosePost, handleReportPost, handleShareAd, handleCopyLink, handleReportWithReason };
};

export { useBusinessPostActions };