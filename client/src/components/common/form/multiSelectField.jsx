import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

const MultiSelectField = ({label, name, error, options, value, onChange}) => {
    const arOptions = !Array.isArray(options) && typeof options === 'object' ?
        Object.keys(options).map(key => ({label: options[key].name, value: options[key]._id})) :
        options

    value = arOptions.filter(opt => value.includes(opt.value))

    const handleChange = (value) => {
        onChange({name: name, value: value.map(el => el.value)})
    }
    const getInputClasses = () => {
        const classes = ['basic-multi-select']
        if (error)
            classes.push('is-invalid')

        return classes.join(' ')
    }
    return (
        <div className="mb-4">
            <label className="form-label">{label}</label>
            <Select
                isMulti
                closeMenuOnSelect={false}
                className={getInputClasses()}
                classNamePrefix="select"
                name={name}
                options={arOptions}
                value={value}
                onChange={handleChange}
            />
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    )
}
MultiSelectField.defaultProps = {
    options: [],
}
MultiSelectField.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.array,
    error: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.object),
        PropTypes.objectOf(PropTypes.object)
    ]),
}

export default MultiSelectField
