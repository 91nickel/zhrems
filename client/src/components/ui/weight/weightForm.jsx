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

const defaultData = {
    value: 50,
    user: '',
    date: new Date(),
}

defaultData.date.setHours(0)
defaultData.date.setMinutes(0)
defaultData.date.setSeconds(0)
defaultData.date.setMilliseconds(0)

const WeightForm = ({startData, onlyValue, onSubmit}) => {

    const dispatch = useDispatch()

    const {userId, isAdmin} = useSelector(userSelector.authData())

    const users = useSelector(userSelector.get())

    const initialData = Object.keys(startData).length
        ? createFields(startData)
        : createFields(defaultData)

    const [data, setData] = useState(initialData)
    const [errors, setErrors] = useState({})
    const globalError = useSelector(selector.error())
    const globalSuccess = useSelector(selector.success())

    useEffect(() => {
        dispatch(action.clearMessages())
        // setData({...data, ...createFields(startData)})
    }, [])

    useEffect(() => {
        validate()
    }, [data])

    function createFields (weight) {
        console.log('createFields', weight, {...weight})
        return {...weight, date: new Date(weight.date)}
    }

    const onChange = target => {
        setData(prevState => {
            const autoUpdateFields = ['proteins', 'fats', 'carbohydrates']
            const nextState = {...prevState, [target.name]: target.value}
            if (autoUpdateFields.includes(target.name)) {
                nextState.calories = nextState.proteins * 4 + nextState.fats * 9 + nextState.carbohydrates * 4
            }
            return nextState
        })
    }
    const onChangeTime = ({name, value}) => {
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

    const handleSubmit = event => {
        event.preventDefault()
        if (!validate() || !hasDifference())
            return false
        return onSubmit({...data, date: data.date.toISOString()})
    }

    const validateScheme = yup.object().shape({
        date: yup.date().required('Поле обязательно'),
        user: yup.string().required('Поле обязательно'),
        value: yup.number().required('Поле обязательно'),
    })

    const validate = () => {
        validateScheme.validate(data)
            .then(() => setErrors({}))
            .catch(err => setErrors({[err.path]: err.message}))

        return Object.keys(errors).length === 0
    }

    const hasDifference = () => {
        let hasDifference = false
        Object.keys(defaultData).forEach(key => {
            // console.log(weight[key], data[key], weight[key] === data[key])
            if (data[key] instanceof Date) {
                console.log(data)
                if (data[key].toISOString() !== startData[key])
                    hasDifference = true
            } else {
                if (startData[key] !== data[key])
                    hasDifference = true
            }
        })
        return hasDifference
    }

    console.log('formData', data)

    const isValid = Object.keys(errors).length === 0

    return (
        <form onSubmit={handleSubmit}>
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
}

WeightForm.propTypes = {
    startData: PropTypes.object,
    onlyValue: PropTypes.bool,
    onSubmit: PropTypes.func,
}

export default WeightForm
