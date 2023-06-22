import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import PropTypes from 'prop-types'
import _ from 'lodash'
import * as yup from 'yup'

import { selector as userSelector } from 'store/user'
import { selector, action } from 'store/transaction'

import DateTimeField from 'components/common/form/dateTimeField'
import NumberField from 'components/common/form/numberField'
import SelectField from 'components/common/form/selectField'
import ProductCard from 'components/ui/product/card'
import ProductForm from './productForm'
import MealForm from './mealForm'

const validateScheme = yup.object().shape({
    date: yup.date().required('Поле обязательно'),
    user: yup.string().required('Поле обязательно'),
    products: yup.array().required('Поле обязательно').min(1),
})

const Form = ({onSubmit}) => {
    const dispatch = useDispatch()

    const {id} = useParams()
    const {userId, isAdmin} = useSelector(userSelector.authData())
    const users = useSelector(userSelector.get())

    const transactions = useSelector(selector.get())

    let transaction
    if (id)
        transaction = useSelector(selector.byId(id))

    const defaultShowForm = {product: false, newProduct: false, meal: false}
    const [showForm, setShowForm] = useState(defaultShowForm)

    const defaultData = {
        user: userId,
        date: Date.now(),
        products: [],
    }

    const startData = id
        ? createFields(transaction)
        : createFields(defaultData)

    const [data, setData] = useState(startData)
    const [errors, setErrors] = useState({})
    const globalError = useSelector(selector.error())
    const globalSuccess = useSelector(selector.success())

    useEffect(() => {
        dispatch(action.clearMessages())
    }, [])

    useEffect(() => {
        // dispatch(action.clearMessages())
        // if (transaction)
        //     setData({...data, ...createFields(transaction)})
    }, [])

    useEffect(() => {
        validate()
    }, [data])

    function toggleForm (formName) {
        setShowForm({...showForm, ...defaultShowForm, [formName]: !showForm[formName]})
    }

    function createFields (transaction) {
        const fields = {
            ...transaction,
            date: new Date(transaction.date),
        }
        fields.date.setSeconds(0)
        return fields
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

    const handleSubmit = event => {
        event.preventDefault()
        if (!validate() || !hasDifference())
            return false
        return onSubmit({...data, date: data.date.toISOString()})
    }

    const validate = () => {
        validateScheme.validate(data)
            .then(() => setErrors({}))
            .catch(err => setErrors({[err.path]: err.message}))

        return Object.keys(errors).length === 0
    }

    const hasDifference = () => {
        if (!transaction) return true
        let hasDifference = false
        Object.keys(defaultData).forEach(key => {
            // console.log(weight[key], data[key], weight[key] === data[key])
            if (data[key] instanceof Date) {
                if (data[key].toISOString() !== transaction[key])
                    hasDifference = true
            } else {
                if (transaction[key] !== data[key])
                    hasDifference = true
            }
        })
        return hasDifference
    }

    function onProductAdd (product) {
        console.log('onProductAdd()', product)
        setData({...data, products: [...data.products, product]})
    }

    function onProductDelete (index) {
        console.log('onProductDelete()', index)
        setData({...data, products: data.products.filter((p, i) => i !== index)})
    }

    function onMealAdd (meal) {
        console.log('onMealAdd()', meal)
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
            <div className="product-list mb-3">
                {data.products.map((p, i) => <ProductCard key={`tr.pid.${i}`} product={p} onDelete={() => onProductDelete(i)}/>)}
            </div>
            <div className="d-flex flex-fill">
                <div className="col-12 col-md-6">
                    <button
                        className={'btn w-100 ' + (showForm.product ? 'btn-outline-primary' : 'btn-primary')}
                        type="button"
                        onClick={() => toggleForm('product')}
                    >
                        Выбрать продукт
                    </button>
                </div>
                <div className="col-12 col-md-6">
                    <button
                        className={'btn w-100 ' + (showForm.meal ? 'btn-outline-primary' : 'btn-primary')}
                        type="button"
                        onClick={() => toggleForm('meal')}
                    >
                        Выбрать блюдо
                    </button>
                </div>
            </div>
            <div className="mb-3 py-3">
                {showForm.product && <ProductForm onSubmit={onProductAdd}/>}
                {showForm.meal && <MealForm onSubmit={onMealAdd}/>}
            </div>
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
