import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import PropTypes from 'prop-types'
import _ from 'lodash'
import * as yup from 'yup'

import { selector, action } from 'store/product'

import DateTimeField from 'components/common/form/dateTimeField'
import NumberField from 'components/common/form/numberField'
import SelectField from 'components/common/form/selectField'

const defaultData = {
    name: 'Новый продукт',
    proteins: 0,
    carbohydrates: 0,
    fats: 0,
    calories: 0,
    weight: 200,
}

function createFields (fields) {
    const newFields = {...defaultData}
    Object.keys(newFields).forEach(key => newFields[key] = fields[key])
    return newFields
}

const Form = ({product, onSubmit}) => {
    // const id = product?._id
    // console.log('isNewProduct', isNewProduct)

    const startData = product
        ? createFields(product)
        : createFields(defaultData)

    const [data, setData] = useState(startData)
    const [errors, setErrors] = useState({})
    // const globalError = useSelector(selector.error())
    // const globalSuccess = useSelector(selector.success())

    // useEffect(() => {
    //     dispatch(action.clearMessages())
    // }, [])

    useEffect(() => {
        // dispatch(action.clearMessages())
        // if (transaction)
        //     setData({...data, ...createFields(transaction)})
    }, [])

    // useEffect(() => {
    //     validate()
    // }, [data])

    // const onChange = target => {
    //     console.log('onChange()', target)
    //     const autoUpdateFields = ['proteins', 'fats', 'carbohydrates']
    //     setData(prevState => {
    //         const nextState = {...prevState, [target.name]: target.value}
    //         if (autoUpdateFields.includes(target.name)) {
    //             nextState.calories = nextState.proteins * 4 + nextState.fats * 9 + nextState.carbohydrates * 4
    //         }
    //         return nextState
    //     })
    // }
    //
    // const handleSubmit = event => {
    //     event.preventDefault()
    //     if (!validate() || !hasDifference())
    //         return false
    //     return onSubmit({...data, date: data.date.toISOString()})
    // }
    //
    // const validateScheme = yup.object().shape({
    //     date: yup.date().required('Поле обязательно'),
    //     user: yup.string().required('Поле обязательно'),
    // })
    //
    // const validate = () => {
    //     validateScheme.validate(data)
    //         .then(() => setErrors({}))
    //         .catch(err => setErrors({[err.path]: err.message}))
    //
    //     return Object.keys(errors).length === 0
    // }
    //
    // const hasDifference = () => {
    //     if (!transaction) return true
    //     let hasDifference = false
    //     Object.keys(defaultData).forEach(key => {
    //         // console.log(weight[key], data[key], weight[key] === data[key])
    //         if (data[key] instanceof Date) {
    //             if (data[key].toISOString() !== transaction[key])
    //                 hasDifference = true
    //         } else {
    //             if (transaction[key] !== data[key])
    //                 hasDifference = true
    //         }
    //     })
    //     return hasDifference
    // }
    //
    // const isValid = Object.keys(errors).length === 0

    return 'MealForm'
}

Form.propTypes = {
    onSubmit: PropTypes.func,
}

export default Form
