import React, { useState } from 'react'
import PropTypes from 'prop-types'

const NumberField = ({label, name, placeholder, value, error, onChange}) => {

    const handleChange = ({target}) => {
        onChange({name: target.name, value: +target.value})
    }

    const getInputClasses = () => {
        const classes = ['form-control']
        if (error)
            classes.push('is-invalid')

        return classes.join(' ')
    }

    return (
        <div className="mb-4">
            <label htmlFor={name}>{label}</label>
            <div className="input-group has-validation">
                <input
                    className={getInputClasses()}
                    type="number"
                    placeholder={placeholder}
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    onInput={handleChange}
                />
                {error && <div className="invalid-feedback">{error}</div>}
            </div>
        </div>
    )
}
NumberField.defaultProps = {
    type: 'number',
    placeholder: '',
}
NumberField.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.number,
    error: PropTypes.string,
    onChange: PropTypes.func,
    onInput: PropTypes.func,
}

export default NumberField
