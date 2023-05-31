import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'

const Pagination = ({ currentPage, pageSize, itemsCount, onPageChange }) => {
    const pageCount = Math.ceil(+itemsCount / +pageSize)
    const pages = _.range(1, pageCount + 1)
    if (pageCount === 1) return null
    return (
        <nav>
            <ul className="pagination">
                {pages.map((page) => {
                    return (
                        <li
                            className={
                                'page-item' +
                                (page === currentPage ? ' active' : '')
                            }
                            key={`page_${page}`}
                        >
                            <button
                                type="button"
                                className="page-link"
                                onClick={() => onPageChange(page)}
                            >
                                {page}
                            </button>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}
Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    itemsCount: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired
}

export default Pagination
