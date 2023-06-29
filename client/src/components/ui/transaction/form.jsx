import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import PropTypes from 'prop-types'
import _ from 'lodash'
import * as yup from 'yup'

import { selector, action } from 'store/transaction'
import { selector as userSelector } from 'store/user'
import { selector as dateSelector, action as dateAction } from 'store/date'

import DateTimeField from 'components/common/form/dateTimeField'
import NumberField from 'components/common/form/numberField'
import SelectField from 'components/common/form/selectField'
import ProductCard from 'components/ui/product/card'
import ProductForm from './productForm'
import MealForm from './mealForm'
import { groupTransactions } from 'utils/groupTransactions'
import Transaction from '../dashboard/transaction'
import TransactionsGroup from '../dashboard/transactionsGroup'

const validateScheme = yup.object().shape({
    formDate: yup.date().required('Поле обязательно'),
    formUser: yup.string().required('Поле обязательно'),
    formTransactions: yup.array().required('Поле обязательно').min(1),
})


// Структура объекта data
// user
// date
// [{productsData1, productData2, ...}]

const Form = ({type, onSubmit: onSuccess}) => {
    const params = useParams()
    const dispatch = useDispatch()
    const globalError = useSelector(selector.error())
    const globalSuccess = useSelector(selector.success())

    const {userId, isAdmin} = useSelector(userSelector.authData())
    const users = useSelector(userSelector.get())

    const defaultShowForm = {select: false, new: false, meal: false}
    const [showForm, setShowForm] = useState(defaultShowForm)

    const defaultUser = userId
    const defaultDate = params.date ? new Date(params.date) : useSelector(dateSelector.get())
    const defaultTransactions = []

    const transactions = useSelector(selector.byDateExact(params.date))

    const [formUser, setFormUser] = useState(defaultUser)
    const [formDate, setFormDate] = useState(defaultDate)
    const [formTransactions, setFormTransactions] = useState(defaultTransactions)

    const [errors, setErrors] = useState({})

    useEffect(() => {
        dispatch(action.clearMessages())
        if (type === 'update' && transactions.length) {
            const {user, date} = groupTransactions(transactions)
            setFormTransactions(transactions)
            setFormUser(user)
            setFormDate(date)
        }
    }, [])

    useEffect(() => {
        validate()
    }, [formUser, formDate, formTransactions])

    function validate () {
        validateScheme.validate({formUser, formDate, formTransactions})
            .then(() => setErrors({}))
            .catch(err => setErrors({[err.path]: err.message}))

        return Object.keys(errors).length === 0
    }

    function hasDifference () {
        if (!params.date) return true
        return !_.isEqual(transactions, formTransactions)
    }

    function getTransactionsByDate () {
        return groupTransactions(useSelector(selector.get())
            .filter(t => t.date === params.date))
    }

    async function onTransactionAdd (transaction) {
        console.log('onTransactionDelete()', transaction)
        const transactions = await onSuccess([{...transaction, date: formDate.toISOString(), user: formUser}])
        setFormTransactions([...formTransactions, ...transactions])
    }

    function onTransactionDelete (index) {
        const transaction = transactions[index]
        const newTransactions = transactions.filter((t, i) => index !== i)
        console.log('onTransactionDelete', index, transaction, newTransactions)
        if (transaction?._id)
            return dispatch(action.delete(transaction._id))
                .unwrap()
                .then(() => setFormTransactions(newTransactions))
                .catch((e) => console.error(e))

        return setFormTransactions(newTransactions)
    }

    function onMealAdd (meal) {
        console.log('onMealAdd()', meal)
    }

    function onUserChange ({value}) {
        // console.log('onUserChange()', value)
        setFormUser(value)
    }

    function onDateChange ({value}) {
        // console.log('onDateChange()', value)
        setFormDate(value)
    }

    function onToggleForm (formName) {
        setShowForm({...showForm, ...defaultShowForm, [formName]: !showForm[formName]})
    }

    function onSubmit (event) {
        event.preventDefault()
        if (!validate() || !hasDifference())
            return false
        return onSuccess(formTransactions)
    }

    const isValid = Object.keys(errors).length === 0

    console.log(formUser, formDate, formTransactions)

    return (
        <form onSubmit={onSubmit}>
            {globalSuccess && <div className="alert alert-success">{globalSuccess}</div>}
            {globalError && <div className="alert alert-danger">{globalError}</div>}
            <SelectField
                label="Пользователь"
                name="user"
                value={formUser}
                error={errors.user}
                options={Object.values(users).map(p => ({label: p.name, value: p._id}))}
                onChange={onUserChange}
                disabled={!isAdmin}
            />
            <DateTimeField
                label="Дата/Время"
                name="date"
                value={formDate}
                error={errors.date}
                disabled={true}
                onChange={onDateChange}
            />
            <TransactionsGroup data={formTransactions} onDelete={onTransactionDelete}/>
            <div className="d-flex justify-content-end my-3">
                {Object.values(showForm).find(v => v === true) &&
                <button
                    type="button"
                    className="btn btn-danger me-1"
                    onClick={() => onToggleForm('none')}
                >
                    <i className="bi bi-x"></i>
                </button>
                }
                <button
                    className={'btn me-1 ' + (showForm.select ? 'btn-outline-primary' : 'btn-primary')}
                    type="button"
                    onClick={() => onToggleForm('select')}
                >
                    <i className="bi bi-check-square"></i>
                </button>
                <button
                    className={'btn me-1 ' + (showForm.new ? 'btn-outline-primary' : 'btn-primary')}
                    type="button"
                    onClick={() => onToggleForm('new')}
                >
                    <i className="bi bi-plus"></i>
                </button>
                <button
                    className={'btn ' + (showForm.meal ? 'btn-outline-primary' : 'btn-primary')}
                    type="button"
                    onClick={() => onToggleForm('meal')}
                >
                    <i className="bi bi-list-ul"></i>
                </button>
            </div>
            <div className="mb-3">
                {showForm.select && <ProductForm onSubmit={onTransactionAdd} select={true}/>}
                {showForm.new && <ProductForm onSubmit={onTransactionAdd} select={false}/>}
                {showForm.meal && <MealForm onSubmit={onMealAdd}/>}
            </div>
            {/*<button*/}
            {/*    className="btn btn-primary w-100 mx-auto"*/}
            {/*    type="submit"*/}
            {/*    disabled={!isValid || !hasDifference()}*/}
            {/*>*/}
            {/*    Сохранить*/}
            {/*</button>*/}
        </form>
    )
}

Form.defaultProperties = {
    type: 'create',
}

Form.propTypes = {
    type: PropTypes.string,
    onSubmit: PropTypes.func,
}

export default Form
