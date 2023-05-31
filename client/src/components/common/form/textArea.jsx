import React from 'react'
import PropTypes from 'prop-types'

const TextArea = ({label, name, placeholder, value, error, rows, onChange, onInput}) => {
    const handleChange = ({target}) => {
        onChange({name: target.name, value: target.value})
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
                <textarea
                    className={getInputClasses()}
                    placeholder={placeholder}
                    id={name}
                    name={name}
                    value={value}
                    rows={rows}
                    onChange={handleChange}
                    onInput={handleChange}
                />
                {error && <div className="invalid-feedback">{error}</div>}
            </div>
        </div>
    )
}
TextArea.defaultProps = {
    placeholder: '',
    rows: 3,
}
TextArea.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    error: PropTypes.string,
    rows: PropTypes.number,
    onChange: PropTypes.func,
    onInput: PropTypes.func,
}

export default TextArea
