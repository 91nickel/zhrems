import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import _ from 'lodash'
import * as yup from 'yup'

import TextField from 'components/common/form/textField'
import NumberField from 'components/common/form/numberField'

import { useDispatch, useSelector } from 'react-redux'
import { selector as userSelector } from 'store/user'
import { selector, action } from 'store/weight'
import PropTypes from 'prop-types'

const Form = ({onSubmit}) => {
    const dispatch = useDispatch()

    const {id} = useParams()
    const {userId, isAdmin} = useSelector(userSelector.authData())

    const weights = useSelector(selector.get())

    let weight;
    if (id)
        weight = useSelector(selector.byId(id))

    const lastWeight = weights[0]
    const date = new Date;

    const defaultData = {
        date: `${date.getFullYear()}-${('0' + date.getMonth()).slice(-2)}-${('0' + date.getDate()).slice(-2)}`,
        time: `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`,
        value: lastWeight?.value || 50,
        user: userId,
    }

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

    const handleChange = target => {
        // console.log(target)
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
        return onSubmit(data)
    }

    const validateScheme = yup.object().shape({
        date: yup.string().required('Поле обязательно'),
        time: yup.string().required('Поле обязательно'),
        user: yup.number().required('Поле обязательно'),
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
            // console.log(key, product[key], data[key])
            if (weight[key] !== data[key])
                hasDifference = true
        })
        return hasDifference
    }

    const isValid = Object.keys(errors).length === 0

    console.log(data)

    return (
        <form onSubmit={handleSubmit}>
            {globalSuccess && <div className="alert alert-success">{globalSuccess}</div>}
            {globalError && <div className="alert alert-danger">{globalError}</div>}
            <TextField
                label="Дата"
                type="date"
                name="date"
                value={data.date}
                error={errors.date}
                onChange={handleChange}
            />
            <TextField
                label="Время"
                type="time"
                name="time"
                value={data.time}
                error={errors.time}
                onChange={handleChange}
            />
            <NumberField
                label="Вес"
                name="value"
                step={0.1}
                value={data.value}
                error={errors.value}
                onChange={handleChange}
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
