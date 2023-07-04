import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import PropTypes from 'prop-types'
import _ from 'lodash'
import * as yup from 'yup'

import { selector as userSelector } from 'store/user'
import { selector, action } from 'store/weight'

import SelectField from 'components/common/form/selectField'
import DateField from 'components/common/form/dateField'
import TextField from 'components/common/form/textField'

const validateScheme = yup.object().shape({
    name: yup.string().required('Укажите название'),
})

const SectionForm = ({type, startData, onlyValue, onSubmit: handleSubmit}) => {
    // console.log('WeightForm.startData', startData)

    const dispatch = useDispatch()

    const {userId, isAdmin} = useSelector(userSelector.authData())

    const users = useSelector(userSelector.get())

    const initialData = Object.keys(startData).length
        ? startData
        : {user: isAdmin ? '' : userId, name: ''}

    const [data, setData] = useState(initialData)
    const [errors, setErrors] = useState({})

    const globalError = useSelector(selector.error())
    const globalSuccess = useSelector(selector.success())

    useEffect(() => {
        dispatch(action.clearMessages())
    }, [])

    useEffect(() => {
        validate()
    }, [data])

    function validate () {
        validateScheme.validate(data)
            .then(() => setErrors({}))
            .catch(err => setErrors({[err.path]: err.message}))

        return Object.keys(errors).length === 0
    }

    function onChange ({name, value}) {
        setData({...data, [name]: value})
    }

    function onSubmit (event) {
        event.preventDefault()
        if (!validate() || !hasDifference())
            return false
        return handleSubmit(data)
    }

    function hasDifference () {
        if (type === 'create') return true
        let hasDifference = false
        Object.keys(startData).forEach(key => {
            if (startData[key] !== data[key])
                hasDifference = true
        })
        return hasDifference
    }

    console.log('formData', data, errors)

    const isValid = Object.keys(errors).length === 0

    return (
        <form onSubmit={handleSubmit}>
            {globalSuccess && <div className="alert alert-success">{globalSuccess}</div>}
            {globalError && <div className="alert alert-danger">{globalError}</div>}
            {
                !onlyValue
                &&
                <SelectField
                    label="Пользователь"
                    name="user"
                    value={data.user || ''}
                    error={errors.user}
                    options={Object.values(users).map(p => ({label: p.name, value: p._id}))}
                    onChange={onChange}
                />
            }
            <TextField
                label="Название"
                name="name"
                value={data.name}
                error={errors.name}
                onChange={onChange}
            />
            <button
                type="submit"
                className="btn btn-primary w-100 mx-auto"
                disabled={!isValid || !hasDifference()}
            >
                Сохранить
            </button>
        </form>
    )
}

SectionForm.defaultProps = {
    startData: {},
    onlyValue: false,
    type: 'create',
}

SectionForm.propTypes = {
    type: PropTypes.string,
    startData: PropTypes.object,
    onlyValue: PropTypes.bool,
    onSubmit: PropTypes.func,
}

export default SectionForm
