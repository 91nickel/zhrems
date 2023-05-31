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
        onInput: ({target}) => {
            onSubmit(target.value)
        },
    }

    const handleSubmit = event => {
        event.preventDefault()
        onSubmit(fieldConfig.value)
    }

    return (
        <form className="mt-3" onSubmit={handleSubmit}>
            <TextField {...fieldConfig}/>
        </form>
    )
}

SearchString.propTypes = {
    query: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
}

export default SearchString
