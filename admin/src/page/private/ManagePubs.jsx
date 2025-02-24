import React, { useEffect, useState } from 'react';
import Modal from '../../customs/Modal';
import { formatViewCount } from '../../func';
import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pagination from '../../components/pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import { fetchPubs } from '../../routes/apiRoutes';
import '../../styles/ManagePubs.scss';

const PubsFilter = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        pubType: 'all',
        location: '',
        budget: '',
        performance: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFilters = { ...filters, [name]: value };
        setFilters(updatedFilters);
        onFilterChange(updatedFilters);
    }


    return (
        <div className="filters">
            <input
                type="text"
                name='search'
                placeholder="Rechercher par ID, nom, email ou titre"
                value={filters.search}
                onChange={handleChange}
            />

            <select name='status' value={filters.status} onChange={handleChange}>
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="expired">Expiré</option>
                <option value="suspended">Suspendu</option>
            </select>

            <select name='pubType' value={filters.pubType} onChange={handleChange}>
                <option value="all">Tous les types</option>
                <option value="masthead">Masthead</option>
                <option value="video_in_feed">Vidéo In-Feed</option>
                <option value="native_display">Native Display</option>
                <option value="geolocated">Géolocalisée</option>
            </select>

            <input
                type="text"
                name='location'
                placeholder="Localisation"
                value={filters.location}
                onChange={handleChange}
            />

            <input
                type="number"
                name='budget'
                placeholder="Budget minimum"
                value={filters.budget}
                onChange={handleChange}
            />

            <input
                type="number"
                name='performance'
                placeholder="Performance min (clics / vues)"
                value={filters.performance}
                onChange={handleChange}
            />
        </div>
    );
};


const PubRow = ({ index, pub, onAction }) => {

    const mediaFilesType = (item) => {
        if (item && item.pubType === "masthead") {
            return <img src={item.mediaFiles[0]} alt={item.advertiserName} width={50} height={50} />;
        } else if (item && item.pubType === "video-in-feed") {
            return <video controls width={50} height={50}>
                <source src={item.mediaFiles[0]} type="video/mp4" />
            </video>;
        } else if (item && item.pubType === "native-display") {
            return <img src={item.mediaFiles[0]} alt={item.advertiserName} width={50} height={50} />;
        } else if (item && item.pubType === "geo-located") {
            return <img src={item.mediaFiles[0]} alt={item.advertiserName} width={50} height={50} />;
        } else {
            return "unknown";
        }
    };

    const formatPostStatut = (status) => {
        switch (status) {
            case "active":
                return "🟢 Actif";
            case "refused":
                return "🔴 Expiré";
            default:
                return "⚫ Indéfini";
        }
    };

    return (
        <tr>
            <td>{index + 1}</td>
            <td>{pub.pubID}</td>
            <td>{mediaFilesType(pub)}</td>
            {/* <td>{pub.mediaFiles && <img src={pub.mediaFiles[0]} alt={pub.advertiserName} width={50} height={50} />}</td> */}
            <td>{pub.advertiserName || "Inconnu"}</td>
            <td>{pub.contact}</td>
            <td>{formatViewCount(pub.views)}</td>
            <td>{formatViewCount(pub.clicks)}</td>
            <td>{pub.views ? ((pub.clicks / pub.views) * 100).toFixed(1) + "%" : "0%"}</td>
            <td>{formatPostStatut(pub.status)}</td>
            <td>{pub.reportingCount || 0}</td>
            <td>
                <button className="see-more" onClick={() => onAction(pub)}>Voir</button>
            </td>
        </tr>
    )
};

export default function ManagePubs() {
    const [pubs, setPubs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pubPerPage] = useState(10);
    const [filteredPubs, setFilteredPubs] = useState([]);
    const [modalType, setModalType] = useState(null);
    const [openFilter, setOpenFilter] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchPubs();

            if (result.success) {
                setPubs(result.pubs);
                setFilteredPubs(result.pubs);
            }
        };

        fetchData();
    }, []);

    const indexOfLastPub = currentPage * pubPerPage;
    const indexOfFirstPub = indexOfLastPub - pubPerPage;
    const currentPubs = filteredPubs.slice(indexOfFirstPub, indexOfLastPub);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleFilterChange = (filters) => {
        const filtered = pubs.filter(pub =>
            (filters.status === 'all' || pub.status === filters.status) &&
            (filters.pubType === 'all' || pub.pubType === filters.pubType) &&
            (filters.location === '' || pub.location === filters.location) &&
            (filters.budget === '' || pub.budget >= filters.budget) &&
            (filters.performance === '' || pub.performance >= filters.performance) &&
            (filters.search === "" ||
                pub.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                pub.pubID.toLowerCase().includes(filters.search.toLowerCase()) ||
                pub.advertiserName.toLowerCase().includes(filters.search.toLowerCase()) ||
                pub.contact.toLowerCase().includes(filters.search.toLowerCase())
            )
        );
        setFilteredPubs(filtered);
    };


    const handleAction = (pub) => {
        const PubID = pub?.PubID;
        const pub_id = PubID.toLowerCase();
        navigate(`${pub_id}`);
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
        <div className="manage-pubs">
            <div className="head">
                <h2>Gestion des Publicités</h2>
                <div className="filters-container">
                    <div className="filter" onClick={() => setOpenFilter(!openFilter)}>
                        <FontAwesomeIcon icon={faFilter} />
                    </div>
                    <div className="create-pubs" onClick={() => navigate('create-pub')}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Ajouter une publicité</span>
                    </div>
                </div>
            </div>

            {openFilter && (
                <PubsFilter onFilterChange={handleFilterChange} />
            )}

            <div className="ads-list">
                <div className="card-list">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Pub ID</th>
                                <th>📸 Image</th>
                                <th>👤 Annonceur</th>
                                <th>✉️ Email</th>
                                <th>👀 Vues</th>
                                <th>📌 Clics</th>
                                <th>📊 Conversion (%)</th>
                                <th>⚡ Statut</th>
                                <th>🚨 Signalements</th>
                                <th>🛠️ Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPubs.length === 0 ? (
                                <tr>
                                    <td colSpan="12">Aucune publicité trouvée.</td>
                                </tr>
                            ) : null}
                            {currentPubs.map((pub, index) => (
                                <PubRow
                                    key={pub.id}
                                    index={index}
                                    pub={pub}
                                    onAction={(pub) => handleAction(pub)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={currentPage}
                    elements={pubs}
                    elementsPerPage={pubPerPage}
                    paginate={paginate}
                />
            </div>
        </div >
    );
};
