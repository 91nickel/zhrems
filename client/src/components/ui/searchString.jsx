import React from 'react'
import PropTypes from 'prop-types'
import TextField from 'components/common/form/textField'

const SearchString = ({query, onSubmit}) => {
    const fieldConfig = {
        label: '',
        placeholder: 'Search...',
        type: 'text',
        name: 'search',
        value: query,
        error: '',
        onChange: data => onSubmit(data.value),
    }

    return (
        <TextField {...fieldConfig} />
    )
}

SearchString.propTypes = {
    query: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
}

export default SearchString
