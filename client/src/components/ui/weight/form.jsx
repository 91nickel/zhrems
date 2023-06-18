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

const Form = ({onSubmit}) => {
    const dispatch = useDispatch()

    const {id} = useParams()
    const {userId, isAdmin} = useSelector(userSelector.authData())
    const users = useSelector(userSelector.get())

    const weights = useSelector(selector.get())

    let weight
    if (id)
        weight = useSelector(selector.byId(id))

    const lastWeight = weights[0]

    const defaultData = {
        date: id ? new Date(weight.date) : new Date(),
        value: id ? weight.value : (lastWeight?.value || 50),
        user: userId,
    }
    defaultData.date.setSeconds(0)

    const [data, setData] = useState({...defaultData})
    const [errors, setErrors] = useState({})
    const globalError = useSelector(selector.error())
    const globalSuccess = useSelector(selector.success())

    useEffect(() => {
        dispatch(action.clearMessages())
        if (weight)
            setData({...data, ...createFields(weight)})
    }, [])

    useEffect(() => {
        validate()
    }, [data])

    function createFields (weight) {
        return {}
    }

    const onChange = target => {
        console.log('onChange()', target)
        const autoUpdateFields = ['proteins', 'fats', 'carbohydrates']
        setData(prevState => {
            const nextState = {...prevState, [target.name]: target.value}
            if (autoUpdateFields.includes(target.name)) {
                nextState.calories = nextState.proteins * 4 + nextState.fats * 9 + nextState.carbohydrates * 4
            }
            return nextState
        })
    }

    const handleSubmit = (event) => {
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
        Object.keys(defaultData).forEach(key => {
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
            <DateTimeField
                label="Дата/Время"
                name="date"
                value={data.date}
                error={errors.date}
                onChange={onChange}
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
