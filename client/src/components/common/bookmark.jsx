import React from 'react'
import PropTypes from 'prop-types'

const Bookmark = ({ id, status, onBookmark }) => {
    return (
        <button
            type="button"
            className="btn btn-outline-dark btn-sm"
            onClick={() => onBookmark(id)}
        >
            <i
                className={`bi ${status ? 'bi-bookmark-fill' : 'bi-bookmark'}`}
            />
        </button>
    )
}

Bookmark.propTypes = {
    id: PropTypes.string.isRequired,
    status: PropTypes.bool.isRequired,
    onBookmark: PropTypes.func.isRequired
}

export default Bookmark
