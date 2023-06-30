import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import PropTypes from 'prop-types'
import _ from 'lodash'
import * as yup from 'yup'

import { selector, action } from 'store/feed'
import { selector as userSelector } from 'store/user'
import { selector as dateSelector, action as dateAction } from 'store/date'

import DateTimeField from 'components/common/form/dateTimeField'
import NumberField from 'components/common/form/numberField'
import SelectField from 'components/common/form/selectField'
import ProductCard from 'components/ui/product/card'
import ProductForm from './productForm'
import MealForm from './mealForm'
import { groupFeeds } from 'utils/groupFeeds'
import Feed from '../dashboard/feed'
import FeedsGroup from '../dashboard/feedsGroup'

const validateScheme = yup.object().shape({
    formDate: yup.date().required('Поле обязательно'),
    formUser: yup.string().required('Поле обязательно'),
    formFeeds: yup.array().required('Поле обязательно').min(1),
})

// Структура объекта data
// user
// date
// [{productsData1, productData2, ...}]

const Form = ({type, startData, onSubmit: onSuccess}) => {
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
    const defaultFeeds = []

    const feeds = useSelector(selector.byDateExact(params.date))

    const [formUser, setFormUser] = useState(defaultUser)
    const [formDate, setFormDate] = useState(defaultDate)
    const [formFeeds, setFormFeeds] = useState(defaultFeeds)

    const [errors, setErrors] = useState({})

    useEffect(() => {
        dispatch(action.clearMessages())
        if (type === 'update' && feeds.length) {
            const {user, date} = groupFeeds(feeds)
            setFormFeeds(feeds)
            setFormUser(user)
            setFormDate(date)
        }
    }, [])

    useEffect(() => {
        validate()
    }, [formUser, formDate, formFeeds])

    function validate () {
        validateScheme.validate({formUser, formDate, formFeeds})
            .then(() => setErrors({}))
            .catch(err => setErrors({[err.path]: err.message}))

        return Object.keys(errors).length === 0
    }

    function hasDifference () {
        if (!params.date) return true
        return !_.isEqual(feeds, formFeeds)
    }

    function getFeedsByDate () {
        return groupFeeds(useSelector(selector.get())
            .filter(t => t.date === params.date))
    }

    async function onFeedAdd (feed) {
        console.log('onFeedAdd()', feed)
        const feeds = await onSuccess([{...feed, date: formDate.toISOString(), user: formUser}])
        setFormFeeds([...formFeeds, ...feeds])
    }

    function onFeedDelete (index) {
        const feed = feeds[index]
        const newFeeds = feeds.filter((t, i) => index !== i)
        console.log('onFeedDelete', index, feed, newFeeds)
        if (feed?._id)
            return dispatch(action.delete(feed._id))
                .unwrap()
                .then(() => setFormFeeds(newFeeds))
                .catch((e) => console.error(e))

        return setFormFeeds(newFeeds)
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
        return onSuccess(formFeeds)
    }

    const isValid = Object.keys(errors).length === 0

    console.log(formUser, formDate, formFeeds)

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
            <FeedsGroup data={formFeeds} onDelete={onFeedDelete}/>
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
                    <i className="bi bi-check-square"/>
                </button>
                <button
                    className={'btn me-1 ' + (showForm.new ? 'btn-outline-primary' : 'btn-primary')}
                    type="button"
                    onClick={() => onToggleForm('new')}
                >
                    <i className="bi bi-plus"/>
                </button>
                <button
                    className={'btn ' + (showForm.meal ? 'btn-outline-primary' : 'btn-primary')}
                    type="button"
                    onClick={() => onToggleForm('meal')}
                >
                    <i className="bi bi-list-ul"/>
                </button>
            </div>
            <div className="mb-3">
                {showForm.select && <ProductForm onSubmit={onFeedAdd} select={true}/>}
                {showForm.new && <ProductForm onSubmit={onFeedAdd} select={false}/>}
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
    startData: {},
}

Form.propTypes = {
    type: PropTypes.string,
    startData: PropTypes.object,
    onSubmit: PropTypes.func,
}

export default Form
