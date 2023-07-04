import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import _ from 'lodash'
import * as yup from 'yup'
import PropTypes from 'prop-types'

import TextField from 'components/common/form/textField'
import NumberField from 'components/common/form/numberField'
import SelectField from 'components/common/form/selectField'

import { selector, action } from 'store/product'
import { selector as sectionSelector } from 'store/section'
import { selector as userSelector } from 'store/user'

import calculateCalories from 'utils/calculateCalories'

const defaultData = {
    name: '',
    desc: '',
    section: '',
    user: '',
    proteins: 0,
    fats: 0,
    carbohydrates: 0,
    calories: 0,
    weight: 100,
}

const validateScheme = yup.object().shape({
    name: yup.string().required('Имя должно быть указано'),
    proteins: yup.number().required('Поле обязательно'),
    fats: yup.number().required('Поле обязательно'),
    carbohydrates: yup.number().required('Поле обязательно'),
    calories: yup.number().required('Поле обязательно'),
})

const ProductForm = ({type, startData, onSubmit: handleSubmit}) => {
    const dispatch = useDispatch()

    const {id} = useParams()

    const sections = useSelector(sectionSelector.get())
    const users = useSelector(userSelector.get())
    const {userId, isAdmin} = useSelector(userSelector.authData())
    const globalError = useSelector(selector.error())
    const globalSuccess = useSelector(selector.success())

    const [data, setData] = useState({...defaultData, user: userId})
    const [errors, setErrors] = useState({})

    useEffect(() => {
        dispatch(action.clearMessages())
        setData({...data, ...startData})
    }, [])

    useEffect(() => {
        validate()
    }, [data])

    function onChange ({name, value}) {
        const autoUpdateFields = ['proteins', 'fats', 'carbohydrates']
        setData(prevState => {
            const nextState = {...prevState, [name]: value}
            if (autoUpdateFields.includes(name)) {
                nextState.calories = calculateCalories(nextState)
            }
            return nextState
        })
    }

    function onSubmit (event) {
        event.preventDefault()
        if (!validate() || !hasDifference())
            return false
        return handleSubmit(data)
    }

    function validate () {
        validateScheme.validate(data)
            .then(() => setErrors({}))
            .catch(err => setErrors({[err.path]: err.message}))

        return Object.keys(errors).length === 0
    }

    function hasDifference () {
        if (type === 'create') return true
        let hasDifference = false
        Object.keys(defaultData).forEach(key => {
            if (startData[key] !== data[key])
                hasDifference = true
        })
        return hasDifference
    }

    const isValid = Object.keys(errors).length === 0

    return (
        <form onSubmit={onSubmit}>
            {globalSuccess && <div className="alert alert-success">{globalSuccess}</div>}
            {globalError && <div className="alert alert-danger">{globalError}</div>}
            <SelectField
                label="Пользователь"
                name="user"
                value={data.user || ''}
                error={errors.user}
                defaultValue="Не выбран"
                options={Object.values(users).map(p => ({label: p.name, value: p._id}))}
                onChange={onChange}
                disabled={!isAdmin}
            />
            <TextField
                label="Наименование"
                type="text"
                name="name"
                value={data.name}
                error={errors.name}
                onChange={onChange}
            />
            <TextField
                label="Описание"
                type="text"
                name="desc"
                value={data.desc}
                error={errors.desc}
                onChange={onChange}
            />
            <SelectField
                label="Раздел"
                name="section"
                value={data.section || ''}
                error={errors.section}
                defaultValue="Без раздела"
                options={Object.values(sections).map(p => ({label: p.name, value: p._id}))}
                onChange={onChange}
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
            <div className="d-flex">
                <div className="col-12 col-md-6">
                    <NumberField
                        label="ККАЛ"
                        name="calories"
                        value={data.calories}
                        error={errors.calories}
                        onChange={onChange}
                    />
                </div>
                <div className="col-12 col-md-6">
                    <NumberField
                        label="Вес по умолчанию"
                        name="weight"
                        value={data.weight}
                        error={errors.weight}
                        onChange={onChange}
                    />
                </div>
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

ProductForm.defaultProps = {
    type: 'create',
    startData: {},
}

ProductForm.propTypes = {
    type: PropTypes.string,
    startData: PropTypes.object,
    onSubmit: PropTypes.func,
}

export default ProductForm
