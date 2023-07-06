import React, { useState } from 'react'
import PropTypes from 'prop-types'

const CheckboxField = ({label, name, value, required, error, children, onChange, className}) => {

    const handleChange = ({target}) => {
        onChange({name: name, value: !value})
    }

    const getInputClasses = () => {
        const classes = ['form-check-input']
        if (error)
            classes.push('is-invalid')

        return classes.join(' ')
    }

    return (
        <div className={className}>
            {label && <p><label className="form-label">{label}</label></p>}
            <div className="form-check">
                <input
                    type="checkbox" value=""
                    className={getInputClasses()}
                    id={name}
                    checked={value}
                    onChange={handleChange}
                    required={required}
                />
                <label
                    className="form-check-label"
                    htmlFor={name}
                >
                    {children}
                </label>
                {error && <div className="invalid-feedback">{error}</div>}
            </div>
        </div>
    )
}
CheckboxField.defaultProps = {
    required: false,
    className: 'mb-4',
}
CheckboxField.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.bool.isRequired,
    className: PropTypes.string,
    required: PropTypes.bool,
    error: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
    onChange: PropTypes.func.isRequired,
}

export default CheckboxField
