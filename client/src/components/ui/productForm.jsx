import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import _ from 'lodash'
import * as yup from 'yup'

import TextField from 'components/common/form/textField'
import NumberField from 'components/common/form/numberField'

import { useDispatch, useSelector } from 'react-redux'
import { selector, action } from 'store/product'
import PropTypes from 'prop-types'

const ProductForm = ({onSubmit}) => {
    const dispatch = useDispatch()

    const {id} = useParams()
    const product = useSelector(selector.byId(id))

    const defaultData = {
        name: '',
        desc: '',
        proteins: 0,
        fats: 0,
        carbohydrates: 0,
        calories: 0,
    }

    const [data, setData] = useState({...defaultData})
    const [errors, setErrors] = useState({})
    const globalError = useSelector(selector.error())
    const globalSuccess = useSelector(selector.success())

    useEffect(() => {
        dispatch(action.clearMessages())
        setData(createFields())
    }, [])

    useEffect(() => {
        validate()
    }, [data])

    function createFields () {
        return {...data, ...(product ? product : {})}
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
        name: yup.string().required('Имя должно быть указано'),
        desc: yup.string(),
        proteins: yup.number().required('Поле обязательно'),
        fats: yup.number().required('Поле обязательно'),
        carbohydrates: yup.number().required('Поле обязательно'),
        calories: yup.number().required('Поле обязательно'),
    })

    const validate = () => {
        validateScheme.validate(data)
            .then(() => setErrors({}))
            .catch(err => setErrors({[err.path]: err.message}))

        return Object.keys(errors).length === 0
    }

    const hasDifference = () => {
        if (!product) return true
        let hasDifference = false
        Object.keys(defaultData).forEach(key => {
            // console.log(key, product[key], data[key])
            if (product[key] !== data[key])
                hasDifference = true
        })
        return hasDifference
    }

    const isValid = Object.keys(errors).length === 0

    return (
        <form onSubmit={handleSubmit}>
            {globalSuccess && <div className="alert alert-success">{globalSuccess}</div>}
            {globalError && <div className="alert alert-danger">{globalError}</div>}
            <TextField
                label="Наименование"
                type="text"
                name="name"
                value={data.name}
                error={errors.name}
                onChange={handleChange}
            />
            <TextField
                label="Описание"
                type="text"
                name="desc"
                value={data.desc}
                error={errors.desc}
                onChange={handleChange}
            />
            <div className="d-flex">
                <div className="col-12 col-md-4">
                    <NumberField
                        label="Белки на 100 г"
                        name="proteins"
                        value={data.proteins}
                        error={errors.proteins}
                        onChange={handleChange}
                    />
                </div>
                <div className="col-12 col-md-4">
                    <NumberField
                        label="Жиры на 100 г"
                        name="fats"
                        value={data.fats}
                        error={errors.fats}
                        onChange={handleChange}
                    />
                </div>
                <div className="col-12 col-md-4">
                    <NumberField
                        label="Углеводы на 100 г"
                        name="carbohydrates"
                        value={data.carbohydrates}
                        error={errors.carbohydrates}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <NumberField
                label="ККАЛ"
                name="calories"
                value={data.calories}
                error={errors.calories}
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

ProductForm.propTypes = {
    onSubmit: PropTypes.func,
}

export default ProductForm
