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
    const params = useParams()
    const dispatch = useDispatch()

    const {userId, isAdmin} = useSelector(userSelector.authData())
    const users = useSelector(userSelector.get())

    const transactions = useSelector(selector.get())
        .filter(t => t.date === params.date)

    let transaction = {}
    if (params.date) {
        transactions.forEach(t => {
            if (!Object.values(transaction).length) {
                transaction = {date: params.date, user: t.user, products: []}
            }
            transaction.products.push(t)
        })
    }

    const defaultShowForm = {select: false, new: false, meal: false}
    const [showForm, setShowForm] = useState(defaultShowForm)

    const defaultData = {
        user: userId,
        date: Date.now(),
        products: [],
    }

    const startData = params.date
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
        // console.log('onChange()', target)
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
        // console.log('onProductAdd()', product)
        setData({...data, products: [...data.products, product]})
    }

    function onProductDelete (index) {
        // console.log('onProductDelete()', index)
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
            <ul className="list-group mb-3">
                {
                    data.products.map((p, i) =>
                        <li key={`tr.pid.${i}`} className="list-group-item d-flex justify-content-between">
                            <span className="col-6">{p.name}</span>
                            <span>{p.weight}/{Math.round(p.weight * p.calories / 100)}</span>
                            <button className="btn btn-close" onClick={() => onProductDelete(i)}></button>
                        </li>
                    )
                }
            </ul>
            <div className="mb-3">
                {showForm.select && <ProductForm onSubmit={onProductAdd} select={true}/>}
                {showForm.new && <ProductForm onSubmit={onProductAdd} select={false}/>}
                {showForm.meal && <MealForm onSubmit={onMealAdd}/>}
            </div>
            <div className="d-flex justify-content-end mb-3">
                {Object.values(showForm).find(v => v === true) &&
                <button
                    className="btn btn-danger me-1"
                    type="button"
                    onClick={() => toggleForm('none')}
                >
                    <i className="bi bi-x"></i>
                </button>
                }
                <button
                    className={'btn me-1 ' + (showForm.select ? 'btn-outline-primary' : 'btn-primary')}
                    type="button"
                    onClick={() => toggleForm('select')}
                >
                    <i className="bi bi-check-square"></i>
                </button>
                <button
                    className={'btn me-1 ' + (showForm.new ? 'btn-outline-primary' : 'btn-primary')}
                    type="button"
                    onClick={() => toggleForm('new')}
                >
                    <i className="bi bi-plus"></i>
                </button>
                <button
                    className={'btn ' + (showForm.meal ? 'btn-outline-primary' : 'btn-primary')}
                    type="button"
                    onClick={() => toggleForm('meal')}
                >
                    <i className="bi bi-list-ul"></i>
                </button>
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
