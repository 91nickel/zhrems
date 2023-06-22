import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import PropTypes from 'prop-types'
import _ from 'lodash'
import * as yup from 'yup'

import { selector, action } from 'store/product'

import TextField from 'components/common/form/textField'
import NumberField from 'components/common/form/numberField'
import SelectField from 'components/common/form/selectField'

const defaultData = {
    name: 'Какая-то еда',
    proteins: 0,
    carbohydrates: 0,
    fats: 0,
    calories: 0,
    weight: 200,
}

function createFields (fields) {
    // console.log('createFields', defaultData, fields)
    const newFields = {...defaultData}
    Object.keys(defaultData).forEach(key => newFields[key] = fields[key] || defaultData[key])
    return newFields
}

const validateScheme = yup.object().shape({
    name: yup.string().required('Поле обязательно'),
    weight: yup.number().required('Поле обязательно').moreThan(0),
})

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

    useEffect(() => {
        validate()
    }, [data])

    function validate () {
        validateScheme.validate(data)
            .then(() => setErrors({}))
            .catch(err => setErrors({[err.path]: err.message}))

        return Object.keys(errors).length === 0
    }

    function onProductSelect (target) {
        // console.log('onProductSelect', target)
        const pid = target.value
        const product = products.find(p => p._id === pid)
        setProductId(pid)
        setData(createFields(product))
    }

    function onChange (target) {
        // console.log('onChange', target)
        if (productId && target.name === 'name')
            setProductId('')
        setData({...data, [target.name]: target.value})
    }

    function handleSubmit () {
        onSubmit(data)
        refresh()
    }

    function refresh () {
        setProductId('')
        setData(startData)
    }

    const isValid = Object.keys(errors).length === 0

    return (
        <fieldset>
            <SelectField
                label="Выберите продукт"
                name="product"
                defaultValue="Выбрать продукт"
                value={productId}
                error={errors.product}
                options={Object.values(items).map(p => ({label: p.name, value: p._id}))}
                onChange={onProductSelect}
            />
            <TextField
                label="Или укажите свое название"
                name="name"
                value={data.name}
                error={errors.name}
                onChange={onChange}
            />
            <div className="d-flex">
                <div className="col-12 col-md-4">
                    <NumberField
                        label="Белки/100"
                        name="proteins"
                        value={data.proteins}
                        error={errors.proteins}
                        onChange={onChange}
                    />
                </div>
                <div className="col-12 col-md-4">
                    <NumberField
                        label="Жиры/100"
                        name="fats"
                        value={data.fats}
                        error={errors.fats}
                        onChange={onChange}
                    />
                </div>
                <div className="col-12 col-md-4">
                    <NumberField
                        label="Углеводы/100"
                        name="carbohydrates"
                        value={data.carbohydrates}
                        error={errors.carbohydrates}
                        onChange={onChange}
                    />
                </div>
            </div>
            <NumberField
                label="ККАЛ/100"
                name="calories"
                value={data.calories}
                error={errors.calories}
                onChange={onChange}
            />
            <NumberField
                label="Вес"
                name="weight"
                value={data.weight}
                error={errors.weight}
                onChange={onChange}
            />
            <button
                className="btn btn-primary w-100 mx-auto"
                type="button"
                onClick={handleSubmit}
                disabled={!isValid}
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
