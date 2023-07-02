import React, { useState } from 'react'
import PropTypes from 'prop-types'

const NumberField = ({label, name, step, placeholder, value, error, className, onChange}) => {

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
        <div className={className}>
            <label htmlFor={name}>{label}</label>
            <div className="input-group has-validation">
                <input
                    className={getInputClasses()}
                    type="number"
                    placeholder={placeholder}
                    id={name}
                    name={name}
                    value={value}
                    step={step}
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
    step: 1,
    placeholder: '',
    className: 'mb-4',
}
NumberField.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.number,
    step: PropTypes.number,
    className: PropTypes.string,
    error: PropTypes.string,
    onChange: PropTypes.func,
    onInput: PropTypes.func,
}

export default NumberField
