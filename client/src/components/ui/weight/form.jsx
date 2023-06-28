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

const Form = ({onSubmit}) => {
    const params = useParams()
    console.log(params)

    const dispatch = useDispatch()

    const {id} = useParams()
    const {userId, isAdmin} = useSelector(userSelector.authData())
    const users = useSelector(userSelector.get())

    const weights = useSelector(selector.get())

    let weight
    if (id)
        weight = useSelector(selector.byId(id))

    const lastWeight = weights[0]

    const startData = id
        ? createFields(weight)
        : createFields(getDefaultData())

    const [data, setData] = useState(startData)
    const [errors, setErrors] = useState({})
    const globalError = useSelector(selector.error())
    const globalSuccess = useSelector(selector.success())

    useEffect(() => {
        dispatch(action.clearMessages())
    }, [])

    useEffect(() => {
        dispatch(action.clearMessages())
        if (weight)
            setData({...data, ...createFields(weight)})
    }, [])

    useEffect(() => {
        validate()
    }, [data])

    function getDefaultData () {
        const data = {
            value: lastWeight?.value || 50,
            user: userId,
            date: params.date ? new Date(params.date) : new Date,
        }
        if (!params.date) {
            data.date.setHours(0)
            data.date.setMinutes(0)
            data.date.setSeconds(0)
            data.date.setMilliseconds(0)
        }
        return data
    }

    function createFields (weight) {
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
        if (!weight) return true
        let hasDifference = false
        Object.keys(getDefaultData()).forEach(key => {
            // console.log(weight[key], data[key], weight[key] === data[key])
            if (data[key] instanceof Date) {
                if (data[key].toISOString() !== weight[key])
                    hasDifference = true
            } else {
                if (weight[key] !== data[key])
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
            <SelectField
                label="Пользователь"
                name="user"
                value={data.user}
                error={errors.user}
                options={Object.values(users).map(p => ({label: p.name, value: p._id}))}
                onChange={onChange}
            />
            <DateField
                label="Дата"
                name="date"
                value={data.date}
                error={errors.date}
                onChange={onChange}
                disabled={!!params.date}
            />
            <RadioField
                label="Период"
                name="time"
                value={data.date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})}
                options={[{name: 'Начало дня', value: '00:00'}, {name: 'Конец дня', value: '23:59'}]}
                error={errors.time}
                onChange={onChangeTime}
                disabled={!!params.date}
            />
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

Form.propTypes = {
    onSubmit: PropTypes.func,
}

export default Form
