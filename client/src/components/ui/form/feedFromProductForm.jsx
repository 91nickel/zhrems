import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import PropTypes from 'prop-types'
import _ from 'lodash'
import * as yup from 'yup'

import { selector as productSelector } from 'store/product'
import { selector as userSelector } from 'store/user'

import TextField from 'components/common/form/textField'
import NumberField from 'components/common/form/numberField'
import SelectField from 'components/common/form/selectField'
import CheckboxField from 'components/common/form/checkboxField'

import calculateCalories from 'utils/calculateCalories'

const validateScheme = yup.object().shape({
    name: yup.string().required('Поле обязательно'),
    user: yup.string().required('Поле обязательно'),
    proteins: yup.number().required('Белки обязательно'),
    carbohydrates: yup.number().required('Углеводы обязательно'),
    fats: yup.number().required('Жиры обязательно'),
    calories: yup.number().required('Энергетическая ценность обязательна'),
    weight: yup.number().required('Поле обязательно').moreThan(0),
})

const FeedFromProductForm = ({startData, select, onSubmit: handleSubmit}) => {

    const {userId} = useSelector(userSelector.authData())
    const products = useSelector(productSelector.get())

    const defaultData = {
        name: 'Какая-то еда',
        product: '',
        user: userId,
        proteins: 0,
        carbohydrates: 0,
        fats: 0,
        calories: 0,
        weight: 200,
    }

    const initialData = Object.keys(startData).length ? {...defaultData, ...startData} : defaultData

    const [productId, setProductId] = useState(startData?.product || '')
    const [data, setData] = useState(initialData)
    const [save, setSave] = useState(false)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        validate()
    }, [data])

    function validate () {
        validateScheme.validate(data)
            .then(() => setErrors({}))
            .catch(err => setErrors({[err.path]: err.message}))

        return Object.keys(errors).length === 0
    }

    function onProductSelect ({value: pid}) {
        // console.log('onProductSelect', target)
        const product = products.find(p => p._id === pid)
        setProductId(pid)
        setData(prevState => {
            return {
                ...prevState,
                ...product,
                weight: Object.keys(startData).length ? prevState.weight : product.weight,
                user: userId,
            }
        })
    }

    function onChange ({name, value}) {
        // console.log('onChange', name, value)
        if (productId && name === 'name')
            setProductId('')
        setData(prevState => ({...prevState, [name]: value}))
    }

    function onChangeAutocomplete ({name, value}) {
        // console.log('onChangeAutocomplete', name, value)
        const newState = {...data, [name]: value}
        newState.calories = calculateCalories(newState)
        setData(newState)
    }

    function onSubmit (event) {
        event.preventDefault()
        handleSubmit([
            {...data, product: productId ? productId : null, save},
        ])
        refresh()
    }

    function refresh () {
        setProductId('')
        setData(initialData)
    }

    const isValid = Object.keys(errors).length === 0
    const hasDifference = Object.keys(startData).length === 0 || !_.isEqual(startData, data) || save

    console.log(data, startData, errors, isValid, hasDifference)

    return (
        <form className="d-flex flex-column" onSubmit={onSubmit}>
            <div className="d-flex align-items-end">
                {
                    select
                        ? <SelectField
                            label="Выберите"
                            name="product"
                            className="col-8 mb-4"
                            value={productId}
                            defaultValue="Выбрать продукт"
                            error={errors.product}
                            options={Object.values(products).map(p => ({label: p.name, value: p._id}))}
                            onChange={onProductSelect}
                        />
                        : <TextField
                            label="Свое"
                            name="name"
                            className="col-8 mb-4"
                            value={data.name}
                            error={errors.name}
                            onChange={onChange}
                        />
                }
                <div className="col-2">
                    <NumberField
                        label="Вес"
                        name="weight"
                        value={data.weight}
                        error={errors.weight}
                        onChange={onChange}
                    />
                </div>
                <div className="col-2 mb-4">
                    <button
                        title="Сохранить"
                        className="btn btn-success mx-auto w-100"
                        type="submit"
                        disabled={!isValid || (select && !productId) || !hasDifference}
                    >
                        <i className="bi bi-check"></i>
                    </button>
                </div>
            </div>
            <div>
                {
                    !select
                    && !data.product
                    && <CheckboxField
                        label=""
                        name="save"
                        value={save}
                        error={errors.save}
                        onChange={({value}) => setSave(value)}
                    >
                        Сохранить в продуктах
                    </CheckboxField>
                }
            </div>
            <div className="d-flex align-items-end">
                <div className="col-3">
                    <NumberField
                        label="ККАЛ/100"
                        name="calories"
                        value={data.calories}
                        error={errors.calories}
                        onChange={onChange}
                    />
                </div>
                <div className="col-3">
                    <NumberField
                        label="Б/100"
                        name="proteins"
                        value={data.proteins}
                        error={errors.proteins}
                        onChange={onChangeAutocomplete}
                    />
                </div>
                <div className="col-3">
                    <NumberField
                        label="Ж/100"
                        name="fats"
                        value={data.fats}
                        error={errors.fats}
                        onChange={onChangeAutocomplete}
                    />
                </div>
                <div className="col-3">
                    <NumberField
                        label="У/100"
                        name="carbohydrates"
                        value={data.carbohydrates}
                        error={errors.carbohydrates}
                        onChange={onChangeAutocomplete}
                    />
                </div>
            </div>
        </form>
    )
}

FeedFromProductForm.defaultProps = {
    startData: {},
    select: false,
}

FeedFromProductForm.propTypes = {
    startData: PropTypes.object,
    select: PropTypes.bool,
    onSubmit: PropTypes.func,
}

export default FeedFromProductForm
