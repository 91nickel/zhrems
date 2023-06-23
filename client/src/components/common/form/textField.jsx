import React, { useState } from 'react'
import PropTypes from 'prop-types'

const TextField = ({label, type, name, placeholder, value, error, onChange, onInput, className = 'mb-4'}) => {
    const [showPassword, setShowPassword] = useState(false)
    const handleChange = ({target}) => {
        onChange({name: target.name, value: target.value})
    }
    const getInputClasses = () => {
        const classes = ['form-control']
        if (error)
            classes.push('is-invalid')

        return classes.join(' ')
    }
    const toggleShowPassword = () => {
        setShowPassword(prevState => !prevState)
    }
    return (
        <div className={className}>
            <label htmlFor={name}>{label}</label>
            <div className="input-group has-validation">
                <input
                    className={getInputClasses()}
                    type={showPassword ? 'text' : type}
                    placeholder={placeholder}
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    onInput={handleChange}
                />
                {
                    type === 'password' &&
                    (<button className="btn btn-outline-secondary" onClick={toggleShowPassword}>
                        <i className={'bi' + (showPassword ? ' bi-eye-slash' : ' bi-eye')}/>
                    </button>)
                }
                {error && <div className="invalid-feedback">{error}</div>}
            </div>
        </div>
    )
}
TextField.defaultProps = {
    type: 'text',
    placeholder: '',
}
TextField.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    error: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func,
    onInput: PropTypes.func,
}

export default TextField
