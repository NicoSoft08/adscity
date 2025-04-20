import React from 'react';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Pagination.scss';

export default function Pagination({ currentPage, elements, elementsPerPage, paginate }) {
    const totalPages = Math.ceil(elements.length / elementsPerPage);

    // Définir les numéros de page visibles
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, startPage + 2);
    const pageNumbers = [];

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="pagination">
            {/* Bouton précédent */}
            <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="page-btn"
            >
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            {/* Affichage des pages */}
            {pageNumbers.map((page) => (
                <button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`page-btn ${currentPage === page ? 'active' : ''}`}
                >
                    {page}
                </button>
            ))}

            {/* Bouton suivant */}
            <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="page-btn"
            >
                <FontAwesomeIcon icon={faChevronRight} />
            </button>
        </div>
    );
}
