import React from 'react'
import PropTypes from 'prop-types'
import renderPhrase from 'utils/renderPhrase'

const SearchStatus = ({ value }) => {
    let phrase
    if (value > 0) {
        phrase = [
            value,
            renderPhrase(value, ['человек', 'человека', 'человек']),
            renderPhrase(value, ['тусанет', 'тусанут', 'тусанут']),
            'с тобой сегодня'
        ].join(' ')
    } else {
        phrase = 'Никто с тобой не тусанет'
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
