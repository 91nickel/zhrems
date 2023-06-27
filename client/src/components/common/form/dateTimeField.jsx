import React, { useState } from 'react'
import PropTypes from 'prop-types'

const DateTimeField = ({label, name, placeholder, value, error, onChange, onInput}) => {

    const defaultData = {
        date: value.toLocaleDateString('fr-CA'),
        time: value.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'}),
    }

    const [data, setData] = useState(defaultData)

    const getInputClasses = () => {
        const classes = ['form-control']
        if (error)
            classes.push('is-invalid')

        return classes.join(' ')
    }

    function handleChangeDate ({target}) {
        const newData = {...data, date: target.value}
        setData(newData)
        onChange({name, value: createDateObject(newData)})
    }

    function handleChangeTime ({target}) {
        const newData = {...data, time: target.value}
        setData(newData)
        onChange({name, value: createDateObject(newData)})
    }

    function createDateObject (data) {
        const [year, month, day] = data.date.split('-')
        const [hours, minutes] = data.time.split(':')

        value.setFullYear(+year)
        value.setMonth(+month - 1)
        value.setDate(+day)
        value.setHours(+hours)
        value.setMinutes(+minutes)
        value.setSeconds(0)
        value.setMilliseconds(0)

        return value
    }

    return (
        <fieldset className="input-group has-validation mb-3">
            <legend style={{'fontSize': '16px'}}>{label}</legend>
            <input
                className={getInputClasses()}
                name={name + '-date'}
                type="date"
                placeholder={placeholder}
                value={data.date}
                onChange={handleChangeDate}
                onInput={handleChangeDate}
            />
            <input
                className={getInputClasses()}
                name={name + '-time'}
                type="time"
                placeholder={placeholder}
                value={data.time}
                onChange={handleChangeTime}
                onInput={handleChangeTime}
            />
            {error && <div className="invalid-feedback">{error}</div>}
        </fieldset>
    )
}
DateTimeField.defaultProps = {
    placeholder: '',
}
DateTimeField.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.instanceOf(Date),
    error: PropTypes.string,
    onChange: PropTypes.func,
    onInput: PropTypes.func,
}

export default DateTimeField
