import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import _ from 'lodash'
import * as yup from 'yup'
import PropTypes from 'prop-types'

import { selector as productSelector, action as productAction } from 'store/product'
import { selector as mealSelector, action as mealAction } from 'store/meal'

import TextField from 'components/common/form/textField'
import NumberField from 'components/common/form/numberField'
import SelectField from 'components/common/form/selectField'

import calculateCalories from 'utils/calculateCalories'
import EnergyResults from '../../common/energyResult'

const validateScheme = yup.object().shape({
    name: yup.string().required('Поле обязательно'),
    product: yup.string(),
    proteins: yup.number().required('Белки обязательно'),
    carbohydrates: yup.number().required('Углеводы обязательно'),
    fats: yup.number().required('Жиры обязательно'),
    calories: yup.number().required('Энергетическая ценность обязательна'),
    weight: yup.number().required('Поле обязательно').moreThan(0, 'Укажите вес больше 0'),
})

const ModalFeedFromMealForm = ({onSubmit}) => {

    const meals = useSelector(mealSelector.get())
    const products = useSelector(productSelector.get())

    const [mealId, setMealId] = useState('')
    const [mealIdError, setMealIdError] = useState('')

    const [formFeeds, setFormFeeds] = useState([])
    const [formFeedsErrors, setFormFeedsErrors] = useState([])

    useEffect(() => {
        validate()
    }, [formFeeds])

    function validate () {
        let hasErrors = false
        const feedsErrors = [...formFeedsErrors]
        formFeeds.forEach((feed, i) => {
            try {
                validateScheme.validateSync(feed)
                feedsErrors[i] = {}
            } catch (err) {
                feedsErrors[i] = {[err.path]: err.message}
                hasErrors = true
            }
        })
        if (hasErrors) {
            setFormFeedsErrors(feedsErrors)
            return false
        }
        setFormFeedsErrors(feedsErrors.map(err => ({})))
        return true
    }

    function extractFeeds ({products: mealProducts}) {
        // console.log('extractFeeds', mealProducts)
        return mealProducts.map(p => {
            return {...products.find(prod => prod._id === p._id), ...p, product: p._id}
        })
    }

    function onMealSelect ({value}) {
        // console.log('onMealSelect', value)
        const meal = meals.find(m => m._id === value)
        if (meal) {
            setMealId(meal._id)
            setFormFeeds(extractFeeds(meal))
            setMealIdError('')
        } else {
            setMealIdError('Can not find meal with ID=' + value)
        }
    }

    function onChangeFeed (index, {name, value}) {
        // console.log('onChangeFeed', index, name, value)
        setFormFeeds(prevState => {
            return prevState.map((f, i) => i === index ? {...f, [name]: value} : f)
        })
    }

    function onDeleteFeed (index) {
        // console.log('onDeleteFeed', index)
        setFormFeeds(prevState => {
            return prevState.filter((f, i) => i !== index)
        })
        setFormFeedsErrors(prevState => {
            return prevState.filter((e, i) => i !== index)
        })
        setMealId('')
        setMealIdError('')
    }

    function handleSubmit (event) {
        event.preventDefault()
        onSubmit(formFeeds)
    }

    const isValid = formFeedsErrors.reduce((agr, errors) => {
        return agr + Object.keys(errors).length
    }, 0) === 0

    return (
        <form className="d-flex flex-column" onSubmit={handleSubmit}>
            <SelectField
                label="Выберите"
                name="meal"
                className="col-12 mb-4"
                value={mealId}
                defaultValue="Выбрать комбинацию"
                error={mealIdError}
                options={Object.values(meals).map(m => ({label: m.name, value: m._id}))}
                onChange={onMealSelect}
            />
            {
                formFeeds.length > 0
                &&
                <div className="card mb-3">
                    <div className="card-body p-0">
                        <ul className="list-group-flush p-0 m-0">
                            {
                                formFeeds.map((feed, index) => {
                                    const errors = formFeedsErrors[index] || {}
                                    return (
                                        <li key={'f-' + feed._id} className="list-group-item d-flex flex-wrap align-items-center">
                                            <div className="name col-7 col-md-4">
                                                {feed.name}
                                            </div>
                                            <div
                                                className="results d-none d-md-flex col-md-5 fs-6 pe-2 d-flex justify-content-end">
                                                <EnergyResults
                                                    proteins={feed.proteins}
                                                    fats={feed.fats}
                                                    carbohydrates={feed.carbohydrates}
                                                    calories={feed.calories}
                                                    showZero={false}
                                                />
                                            </div>
                                            <div className="weight col-3 col-md-2 pe-2 fs-6">
                                                <NumberField
                                                    label=""
                                                    name="weight"
                                                    className=""
                                                    value={formFeeds[index].weight}
                                                    error={''}
                                                    onChange={(target) => onChangeFeed(index, target)}
                                                />
                                            </div>
                                            <div className="delete col-2 col-md-1 d-flex justify-content-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger"
                                                    onClick={() => onDeleteFeed(index)}
                                                >
                                                    <i className="bi bi-x"></i>
                                                </button>
                                            </div>
                                            {
                                                Object.keys(errors).length > 0
                                                &&
                                                <div className="col-12 errors">
                                                    {
                                                        Object.values(errors).map((msg, i) =>
                                                            <p
                                                                key={`err-${feed._id}-${i}`}
                                                                className="text-danger fs-6"
                                                            >
                                                                {msg}
                                                            </p>)
                                                    }
                                                </div>
                                            }
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
            }
            <div className="d-flex align-items-end">
                <div className="col-2 mb-4">
                    <button
                        className="btn btn-success mx-auto w-100"
                        type="submit"
                        disabled={!isValid}
                    >
                        <i className="bi bi-check"></i>
                    </button>
                </div>
            </div>
        </form>
    )
}

ModalFeedFromMealForm.defaultProps = {
    startData: {},
    select: false,
}

ModalFeedFromMealForm.propTypes = {
    startData: PropTypes.object,
    select: PropTypes.bool,
    onSubmit: PropTypes.func,
}

export default ModalFeedFromMealForm
