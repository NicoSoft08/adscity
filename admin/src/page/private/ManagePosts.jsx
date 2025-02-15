import React, { useEffect, useState } from "react";
import { fr } from "date-fns/locale";
import { format } from "date-fns";
import { formatViewCount } from "../../func";
import { fetchDataByUserID } from "../../routes/userRoutes";
import { fetchAllPosts, suspendPost, deletePost } from "../../routes/postRoutes";
import Modal from "../../customs/Modal";
import Pagination from "../../components/pagination/Pagination";
import "../../styles/ManagePosts.scss";

const PostTable = ({ index, post, onAction, options }) => {
    const [postOwner, setPostOwner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!post) return;
            const result = await fetchDataByUserID(post.userID);
            if (result.success) {
                setPostOwner(result.data);
            }
            setLoading(false);
        };
        fetchData();
    }, [post]);

    const formatPostStatut = (status) => {
        switch (status) {
            case "pending":
                return "🟠 En attente";
            case "approved":
                return "🟢 Accepté";
            case "refused":
                return "🔴 Rejetée";
            default:
                return "⚫ Indéfini";
        }
    };

    const handleActionClick = () => {
        const postID = post.id;
        console.log(postID);
        onAction(post);
        setOpenModal(true);
    }

    return (
        <>
            <tr>
                <td>{index + 1}</td>
                <td><img src={post.images[0]} alt='' width={50} height={50} /></td>
                <td>{post.adDetails.title}</td>
                <td>{post.adDetails.price} RUB</td>
                <td>{formatViewCount(post.views)}</td>
                <td>{formatViewCount(post.clicks)}</td>
                <td>{post.views ? ((post.clicks / post.views) * 100).toFixed(1) + "%" : "0%"}</td>
                <td>{format(new Date(post.expiry_date), "dd/MM/yyyy HH:mm", { locale: fr })}</td>
                <td>{formatPostStatut(post.status)}</td>
                <td>{loading ? "Chargement..." : postOwner?.displayName || "Inconnu"}</td>
                <td>{post.reportingCount || 0}</td>
                <td>
                    <button className="see-more" onClick={() => handleActionClick(post)}>Détails</button>
                </td>
            </tr>
            {openModal && (
                <Modal title={"Actions"} onShow={openModal} onHide={() => setOpenModal(false)}>
                    <div className="modal-menu">
                        {options.map((option, index) => (
                            <div key={index} className="menu-item" onClick={option.action}>
                                {/* <FontAwesomeIcon icon={option.icon} /> */}
                                <span>{option.icon}</span>
                                <span>{option.label}</span>
                            </div>
                        ))}
                    </div>
                </Modal>
            )}
        </>
    );
};

export default function ManagePosts() {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postPerPage] = useState(10);
    const [selectedPost, setSelectedPost] = useState(null);
    const [modalType, setModalType] = useState(null); // "suspend" | "delete" | null
    const [reason, setReason] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchAllPosts();
            if (result.success) {
                setPosts(result.postsData || []);
            }
        };
        fetchData();
    }, []);

    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleAction = (post, action) => {
        setSelectedPost(post);
        setModalType(action);
    };

    const handleConfirmAction = async () => {
        if (!selectedPost || !modalType || !reason.trim()) {
            alert("Veuillez entrer un motif.");
            return;
        }

        try {
            if (modalType === "suspend") {
                await suspendPost(selectedPost.id, reason);
                console.log(`Annonce ${selectedPost.id} suspendue pour : ${reason}`);
            } else if (modalType === "delete") {
                await deletePost(selectedPost.id, reason);
                console.log(`Annonce ${selectedPost.id} supprimée pour : ${reason}`);
            }
            setPosts(posts.filter(post => post.id !== selectedPost.id)); // Mettre à jour la liste
            setModalType(null);
        } catch (error) {
            console.error(`Erreur lors de l'action (${modalType}) :`, error);
        }
    };

    const handleSuspendPost = () => {
        setModalType('suspend');
    };

    const handleDeletePost = () => {
        setModalType('delete');
    };

    const options = [
        {
            label: 'Suspendre',
            icon: '⏸️',
            action: () => handleSuspendPost(),
        },
        {
            label: 'Supprimer',
            icon: '🗑️',
            action: () => handleDeletePost(),
        },
    ];

    return (
        <div className="ads-section">
            <h2>Gestion des Annonces</h2>
            <div className="ads-list">
                <div className="card-list">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>📸 Image</th>
                                <th>🏷️ Titre</th>
                                <th>💰 Prix</th>
                                <th>👀 Vues</th>
                                <th>📌 Clics</th>
                                <th>📊 Conversion (%)</th>
                                <th>📅 Expiration</th>
                                <th>⚡ Statut</th>
                                <th>👤 Annonceur</th>
                                <th>🚨 Signalements</th>
                                <th>🛠️ Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPosts.map((post, index) => (
                                <PostTable
                                    key={post.id}
                                    index={index}
                                    post={post}
                                    options={options}
                                    onAction={(post) => handleAction(post)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={currentPage}
                    elements={posts}
                    elementsPerPage={postPerPage}
                    paginate={paginate}
                />
            </div>

            {/* MODALE D'ACTION */}
            {modalType && (
                <Modal
                    title={modalType === "suspend" ? "Suspendre l'annonce" : "Supprimer l'annonce"}
                    onShow={!!modalType}
                    onHide={() => setModalType(null)}
                >
                    <div className="action-menu">
                        <p><strong>Annonce :</strong> {selectedPost?.adDetails?.title}</p>
                        <label>Motif de l'action :</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Expliquez pourquoi cette action est nécessaire..."
                            rows="4"
                        />
                        <div className="modal-actions">
                            <button onClick={handleConfirmAction} className="confirm-btn">Confirmer</button>
                            <button onClick={() => setModalType(null)} className="cancel-btn">Annuler</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
