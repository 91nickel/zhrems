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
    const products = useSelector(selector.get())
    // console.log('isNewProduct', isNewProduct)

    const startData = product
        ? createFields(product)
        : createFields(defaultData)

    const [productId, setProductId] = useState(product?._id || '')
    const [data, setData] = useState(startData)
    const [errors, setErrors] = useState({})
    const items = useSelector(selector.get())
    const globalError = useSelector(selector.error())
    const globalSuccess = useSelector(selector.success())

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

    const onProductSelect = target => {
        const pid = target.value
        const product = products.find(p => p._id === pid)
        setData(createFields(product))
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
    })

    const validate = () => {
        validateScheme.validate(data)
            .then(() => setErrors({}))
            .catch(err => setErrors({[err.path]: err.message}))

        return Object.keys(errors).length === 0
    }

    const hasDifference = () => {
        let hasDifference = false
        // Object.keys(defaultData).forEach(key => {
        //     // console.log(weight[key], data[key], weight[key] === data[key])
        //     if (data[key] instanceof Date) {
        //         if (data[key].toISOString() !== transaction[key])
        //             hasDifference = true
        //     } else {
        //         if (transaction[key] !== data[key])
        //             hasDifference = true
        //     }
        // })
        return hasDifference
    }

    const isValid = Object.keys(errors).length === 0

    return (
        <fieldset>
            PRODUCT FORM
            <SelectField
                label="Продукт"
                name="product"
                defaultValue="Выбрать продукт"
                value={productId}
                error={errors.product}
                options={Object.values(items).map(p => ({label: p.name, value: p._id}))}
                onChange={onProductSelect}
            />
            <div className="d-flex">
                <div className="col-12 col-md-4">
                    <NumberField
                        label="Белки на 100 г"
                        name="proteins"
                        value={data.proteins}
                        error={errors.proteins}
                        onChange={onChange}
                    />
                </div>
                <div className="col-12 col-md-4">
                    <NumberField
                        label="Жиры на 100 г"
                        name="fats"
                        value={data.fats}
                        error={errors.fats}
                        onChange={onChange}
                    />
                </div>
                <div className="col-12 col-md-4">
                    <NumberField
                        label="Углеводы на 100 г"
                        name="carbohydrates"
                        value={data.carbohydrates}
                        error={errors.carbohydrates}
                        onChange={onChange}
                    />
                </div>
            </div>
            <NumberField
                label="ККАЛ"
                name="calories"
                value={data.calories}
                error={errors.calories}
                onChange={onChange}
            />
            <button
                className="btn btn-primary w-100 mx-auto"
                type="submit"
                disabled={!isValid || !hasDifference()}
            >
                Добавить
            </button>
        </fieldset>
    )
}

Form.propTypes = {
    product: PropTypes.object,
    onSubmit: PropTypes.func,
}

export default Form
