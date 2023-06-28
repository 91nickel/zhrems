import React, { useState } from 'react'
import PropTypes from 'prop-types'
import RadioField from './radioField'

const DateField = ({label, name, value, error, onChange, onInput, className, disabled}) => {

    const [data, setData] = useState(value.toLocaleDateString('fr-CA'))

    const getInputClasses = () => {
        const classes = ['form-control']
        if (error)
            classes.push('is-invalid')

        return classes.join(' ')
    }

    function handleChange ({target}) {
        setData(target.value)
        onChange({name, value: createDateObject(target.value)})
    }

    function createDateObject (dateString) {
        const [year, month, day] = dateString.split('-')
        const date = new Date(`${year}-${month}-${day}`)
        date.setHours(0)
        return date
    }

    return (
        <div className={className}>
            {label && <label style={{'fontSize': '16px'}}>{label}</label>}
            <div className="input-group has-validation mb-3">
                <input
                    className={getInputClasses()}
                    name={name + '-date'}
                    type="date"
                    value={data}
                    onChange={handleChange}
                    onInput={handleChange}
                    disabled={disabled}
                />
                {error && <div className="invalid-feedback">{error}</div>}
            </div>
        </div>
    )
}

DateField.defaultProps = {
    disabled: false,
}

DateField.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.instanceOf(Date),
    error: PropTypes.string,
    onChange: PropTypes.func,
    onInput: PropTypes.func,
    className: PropTypes.string,
    disabled: PropTypes.bool,
}

export default DateField
