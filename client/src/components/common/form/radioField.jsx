import React, { useState } from 'react'
import PropTypes from 'prop-types'

const RadioField = ({label, name, value, error, onChange, options}) => {
    const handleChange = ({target}) => {
        onChange({name: target.name, value: target.value})
    }
    return (
        <div className="mb-4">
            <label className="form-label">{label}</label>
            <div>
                {options.map(option => (
                    <div key={`${option.name}_${option.value}`} className="form-check form-check-inline">
                        <input
                            type="radio"
                            className="form-check-input"
                            id={`${option.name}_${option.value}`}
                            name={name}
                            value={option.value}
                            checked={option.value === value}
                            onChange={handleChange}
                        />
                        <label
                            className="form-check-label"
                            htmlFor={`${option.name}_${option.value}`}>{option.name}</label>
                    </div>
                ))}
            </div>
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    )
}
RadioField.defaultProps = {}
RadioField.propTypes = {
    label: PropTypes.string,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
        })
    ),
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    error: PropTypes.string,
}

export default RadioField
