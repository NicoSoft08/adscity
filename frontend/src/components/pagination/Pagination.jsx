import React from 'react';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Pagination.scss';

export default function Pagination({ currentPage, elements, elementsPerPage, paginate }) {

    return (
        <div className="pagination">
            <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="page-btn"
            >
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            {Array.from({ length: Math.ceil(elements.length / elementsPerPage) }).map((_, index) => (
                <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                >
                    {index + 1}
                </button>
            ))}

            <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(elements.length / elementsPerPage)}
                className="page-btn"
            >
                <FontAwesomeIcon icon={faChevronRight} />
            </button>
        </div>
    );
};
