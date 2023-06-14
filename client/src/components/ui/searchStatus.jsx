import React from 'react'
import PropTypes from 'prop-types'
import renderPhrase from 'utils/renderPhrase'

const SearchStatus = ({ value }) => {
    let phrase
    if (value > 0) {
        phrase = [
            value,
            renderPhrase(value, ['элемент', 'элемента', 'элементов']),
            renderPhrase(value, ['найден', 'найдено', 'найдено']),
            ''
        ].join(' ')
    } else {
        phrase = 'Ничего не найдено'
    }
    const color = value > 0 ? 'primary' : 'danger'

    return (
        <h2>
            <span className={`badge bg-${color}`}>{phrase}</span>
        </h2>
    )
}

SearchStatus.propTypes = {
    value: PropTypes.number.isRequired
}

export default SearchStatus
