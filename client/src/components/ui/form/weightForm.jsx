import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import PropTypes from 'prop-types'
import _ from 'lodash'
import * as yup from 'yup'

import { selector as userSelector } from 'store/user'
import { selector, action } from 'store/weight'

import DateTimeField from 'components/common/form/dateTimeField'
import NumberField from 'components/common/form/numberField'
import SelectField from 'components/common/form/selectField'
import DateField from 'components/common/form/dateField'
import RadioField from 'components/common/form/radioField'

const validateScheme = yup.object().shape({
    date: yup.date().required('Поле обязательно'),
    user: yup.string().required('Поле обязательно'),
    value: yup.number().required('Поле обязательно'),
})

const WeightForm = ({type, startData, onlyValue, onSubmit: handleSubmit}) => {
    // console.log('WeightForm.startData', startData)

    const dispatch = useDispatch()
    const {userId, isAdmin} = useSelector(userSelector.authData())
    const users = useSelector(userSelector.get())
    const globalError = useSelector(selector.error())
    const globalSuccess = useSelector(selector.success())

    const defaultData = {
        value: 50,
        user: userId,
        date: new Date(),
    }

    defaultData.date.setHours(0)
    defaultData.date.setMinutes(0)
    defaultData.date.setSeconds(0)
    defaultData.date.setMilliseconds(0)

    const initialData = Object.keys(startData).length
        ? createFields(startData)
        : createFields(defaultData)

    const [data, setData] = useState(initialData)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        dispatch(action.clearMessages())
        // setData({...data, ...createFields(startData)})
    }, [])

    useEffect(() => {
        validate()
    }, [data])

    function createFields (weight) {
        // console.log('createFields', weight, {...weight})
        return {...weight, date: new Date(weight.date)}
    }

    function validate () {
        validateScheme.validate(data)
            .then(() => setErrors({}))
            .catch(err => setErrors({[err.path]: err.message}))

        return Object.keys(errors).length === 0
    }

    function onChange  (target) {
        setData(prevState => {
            const autoUpdateFields = ['proteins', 'fats', 'carbohydrates']
            const nextState = {...prevState, [target.name]: target.value}
            if (autoUpdateFields.includes(target.name)) {
                nextState.calories = nextState.proteins * 4 + nextState.fats * 9 + nextState.carbohydrates * 4
            }
            return nextState
        })
    }

    function onChangeTime ({name, value}) {
        const date = data.date
        const [hours, minutes] = value.split(':')
        date.setHours(hours)
        date.setMinutes(minutes)
        if (value === '00:00') {
            date.setSeconds(0)
            date.setMilliseconds(0)
        } else if (value === '23:59') {
            date.setSeconds(59)
            date.setMilliseconds(999)
        }
        setData({...data, date})
    }

    const onSubmit = event => {
        event.preventDefault()
        if (!validate() || !hasDifference())
            return false
        return handleSubmit({...data, date: data.date.toISOString()})
    }

    function hasDifference ()  {
        if (type === 'create') return true
        let hasDifference = false
        Object.keys(defaultData).forEach(key => {
            // console.log(weight[key], data[key], weight[key] === data[key])
            if (data[key] instanceof Date) {
                if (data[key].toISOString() !== startData[key])
                    hasDifference = true
            } else {
                if (startData[key] !== data[key])
                    hasDifference = true
            }
        })
        return hasDifference
    }

    // console.log('formData', data, errors)

    const isValid = Object.keys(errors).length === 0

    return (
        <form onSubmit={onSubmit}>
            {globalSuccess && <div className="alert alert-success">{globalSuccess}</div>}
            {globalError && <div className="alert alert-danger">{globalError}</div>}
            {
                !onlyValue
                &&
                <SelectField
                    label="Пользователь"
                    name="user"
                    value={data.user}
                    error={errors.user}
                    options={Object.values(users).map(p => ({label: p.name, value: p._id}))}
                    onChange={onChange}
                />
            }
            {
                !onlyValue
                &&
                <DateField
                    label="Дата"
                    name="date"
                    value={data.date}
                    error={errors.date}
                    onChange={onChange}
                />
            }
            {
                !onlyValue
                &&
                <RadioField
                    label="Период"
                    name="time"
                    value={data.date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})}
                    options={[{name: 'Начало дня', value: '00:00'}, {name: 'Конец дня', value: '23:59'}]}
                    error={errors.time}
                    onChange={onChangeTime}
                />
            }
            <NumberField
                label="Вес"
                name="value"
                step={0.1}
                value={data.value}
                error={errors.value}
                onChange={onChange}
            />
            <button
                className="btn btn-primary w-100 mx-auto"
                type="submit"
                disabled={!isValid || !hasDifference()}
            >
                Сохранить
            </button>
        </form>
    )
}

WeightForm.defaultProps = {
    startData: {},
    onlyValue: false,
    type: 'create',
}

WeightForm.propTypes = {
    type: PropTypes.string,
    startData: PropTypes.object,
    onlyValue: PropTypes.bool,
    onSubmit: PropTypes.func,
}

export default WeightForm
