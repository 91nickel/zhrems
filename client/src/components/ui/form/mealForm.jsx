import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import PropTypes from 'prop-types'
import _ from 'lodash'
import * as yup from 'yup'

import { selector as mealSelector, action as mealAction } from 'store/meal'
import { selector as productSelector, action as productAction } from 'store/product'
import { selector as userSelector } from 'store/user'

import TextField from 'components/common/form/textField'
import NumberField from 'components/common/form/numberField'
import SelectField from 'components/common/form/selectField'
import EnergyResults from 'components/common/energyResult'
import calculateAverageEnergy from 'utils/calculateAverageEnergy'


const defaultData = {
    name: '',
    user: '',
    desc: '',
    weight: 100,
}

const defaultProduct = {
    _id: '',
    name: '',
    desc: '',
    proteins: 0,
    fats: 0,
    carbohydrates: 0,
    calories: 0,
    weight: 100,
}

const validateSchemeForm = yup.object().shape({
    name: yup.string().required('Имя должно быть указано'),
    desc: yup.string(),
    weight: yup.number().required('Поле обязательно').min(1),
})

const validateSchemeProduct = yup.object().shape({
    _id: yup.string().required('ID должен быть указан'),
    weight: yup.number().min(1),
})

const MealForm = ({type, startData, onSubmit: handleSubmit}) => {
    const dispatch = useDispatch()

    const products = useSelector(productSelector.get())
    const users = useSelector(userSelector.get())
    const {userId, isAdmin} = useSelector(userSelector.authData())

    const [formData, setFormData] = useState({...defaultData, user: userId})
    const [formProducts, setFormProducts] = useState([])

    const [formErrors, setFormErrors] = useState({})
    const [formProductsErrors, setFormProductsErrors] = useState([])

    const globalError = useSelector(mealSelector.error())
    const globalSuccess = useSelector(mealSelector.success())

    let initialProducts = []
    if (startData.products?.length) {
        initialProducts = products
            .filter(fullProduct => startData.products.map(mp => mp._id).includes(fullProduct._id))
            .map(fullProduct => ({...fullProduct, ...startData.products.find(mp => mp._id === fullProduct._id)}))
    }

    useEffect(() => {
        dispatch(mealAction.clearMessages())
        if (Object.keys(startData).length > 0) {
            setFormData(prevState => ({...prevState, ...startData}))
            setFormProducts(prevState => ([...prevState, ...initialProducts]))
            setFormProductsErrors(prevState => prevState.map(() => ({})))
        }
    }, [])

    useEffect(() => {
        validate()
        validateProducts()
        const weight = Object.values(formProducts).reduce((agr, p) => {
            return agr + p.weight
        }, 0)
        if (weight !== formData.weight)
            setFormData(prevState => ({...prevState, weight}))
    }, [formData, formProducts])

    function onChange ({name, value}) {
        // console.log(target)
        const autoUpdateFields = ['proteins', 'fats', 'carbohydrates']
        setFormData(prevState => ({...prevState, [name]: value}))
    }

    function onCreateEmptyProduct () {
        // console.log('handleAddEmptyProduct', formProducts, formProductsErrors)
        setFormProducts(prevState => ([...prevState, {...defaultProduct}]))
        setFormProductsErrors(prevState => ([...prevState, {}]))
    }

    function onDeleteProduct (index) {
        // console.log('handleRemoveProduct', index)
        setFormProducts(prevState => prevState.filter((p, i) => i !== index))
        setFormProductsErrors(prevState => prevState.filter((p, i) => i !== index))
    }

    function onSelectProduct (index, pid) {
        // console.log('handleSelectProduct', index, pid)
        setFormProducts(prevState => prevState.map((p, i) => i === index ? products.find(p => p._id === pid) : p))
    }

    function onChangeWeight (index, value) {
        // console.log('handleChangeWeight', index, value)
        setFormProducts(prevState => prevState.map((p, i) => i === index ? {...p, weight: value} : p))
    }

    function onSubmit (event) {
        // console.log(validate(), validateProducts(), hasDifference())
        event.preventDefault()
        if (!validate() || !validateProducts() || !hasDifference())
            return false

        return handleSubmit({
            ...formData,
            user: formData.user ? formData.user : null,
            products: formProducts.map(p => ({_id: p._id, weight: p.weight})),
        })
    }

    function validate () {
        validateSchemeForm.validate(formData)
            .then(() => setFormErrors({}))
            .catch(err => setFormErrors({[err.path]: err.message}))

        return Object.values(formErrors).filter(e => !Array.isArray(e)).length === 0
    }

    function validateProducts () {
        let hasProductErrors = false
        const newProductErrors = [...formProductsErrors]
        formProducts.forEach((p, i) => {
            validateSchemeProduct.validate(p)
                .then(() => {
                    newProductErrors[i] = {}
                })
                .catch(err => {
                    hasProductErrors = true
                    newProductErrors[i][err.path] = err.message
                })
        })
        setFormProductsErrors(newProductErrors)
        return !hasProductErrors
    }

    function hasDifference () {
        if (type === 'create') return true
        let hasDifference = false
        Object.keys(defaultData).forEach(key => {
            if (startData[key] !== formData[key])
                hasDifference = true
        })
        if (!_.isEqual(initialProducts, formProducts))
            hasDifference = true

        // console.log('hasDifference', initialProducts, formProducts)
        return hasDifference
    }

    const results = calculateAverageEnergy(products)

    const isValid = Object.keys(formErrors).length === 0
        && Object.values(formProductsErrors).reduce((agr, err) => agr + Object.keys(err).length, 0) === 0
        && formProducts.length > 0

    // console.log(formData, formProducts)

    return (
        <form onSubmit={onSubmit}>
            {globalSuccess && <div className="alert alert-success">{globalSuccess}</div>}
            {globalError && <div className="alert alert-danger">{globalError}</div>}
            <div>
                <TextField
                    label="Наименование"
                    type="text"
                    name="name"
                    value={formData.name}
                    error={formErrors.name}
                    onChange={onChange}
                />
                <TextField
                    label="Описание"
                    type="text"
                    name="desc"
                    value={formData.desc}
                    error={formErrors.desc}
                    onChange={onChange}
                />
                <SelectField
                    label="Пользователь"
                    name="user"
                    value={formData.user || ''}
                    error={formErrors.user}
                    defaultValue="Не выбран"
                    options={Object.values(users).map(p => ({label: p.name, value: p._id}))}
                    onChange={onChange}
                    disabled={!isAdmin}
                />
            </div>
            <div className="d-flex flex-column">
                {
                    formProducts.map((p, i) => {
                        return (
                            <div key={'p-' + i} className="d-flex mb-2">
                                <div className="d-flex col-5">
                                    <SelectField
                                        label="Продукт"
                                        name="product"
                                        className="w-100"
                                        value={p._id}
                                        defaultValue="Выберите продукт"
                                        error={formProductsErrors[i]?._id}
                                        options={Object.values(products).map(p => ({label: p.name, value: p._id}))}
                                        onChange={({value: pid}) => onSelectProduct(i, pid)}
                                    />
                                </div>
                                <div className="d-flex col-2">
                                    <NumberField
                                        label="Вес"
                                        name="weight"
                                        className="mb-0 w-100"
                                        value={p.weight}
                                        error={formProductsErrors[i]?.weight}
                                        onChange={({value}) => onChangeWeight(i, value)}
                                    />
                                </div>
                                <div className="results col-4 fs-7 pt-4">
                                    <div className="d-flex justify-content-end align-items-center">
                                        <EnergyResults
                                            proteins={p.proteins}
                                            fats={p.fats}
                                            carbohydrates={p.carbohydrates}
                                            calories={p.calories}
                                            showZero={true}
                                        />
                                    </div>
                                </div>
                                <div className="delete col-1 pt-4">
                                    <div className="d-flex justify-content-end">
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            onClick={() => onDeleteProduct(i)}
                                        >
                                            <i className="bi bi-x"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className="d-flex justify-content-end mb-3">
                <button type="button" className="btn btn-outline-success" onClick={onCreateEmptyProduct}>
                    <i className="bi bi-plus"></i>
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

MealForm.defaultProps = {
    type: 'create',
    startData: {},
}

MealForm.propTypes = {
    type: PropTypes.string,
    startData: PropTypes.object,
    onSubmit: PropTypes.func,
}

export default MealForm
