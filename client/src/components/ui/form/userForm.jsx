import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import * as yup from 'yup'
import PropTypes from 'prop-types'

import { selector } from 'store/user'

import TextField from 'components/common/form/textField'
import RadioField from 'components/common/form/radioField'
import CheckboxField from 'components/common/form/checkboxField'

const sexVariants = [
    {name: 'Male', value: 'male'},
    {name: 'Female', value: 'female'},
    {name: 'Other', value: 'other'},
]

const validateScheme = yup.object().shape({
    name: yup.string()
        .required('Имя обязательно для заполнения'),
    email: yup.string()
        .required('Электронная почта обязательна для заполнения')
        .email('Электронная почта указана в неверном формате'),
    sex: yup.string().oneOf(sexVariants.map(s => s.value))
        .required('Необходимо указать пол'),
    license: yup.bool()
        .required('Необходимо согласие на обработку персональных данных')
        .isTrue('Вы не можете использовать наш сервис без подтверждения'),
})

const defaultData = {
    name: '',
    sex: sexVariants[0],
    email: '',
    license: false,
}

const UserForm = ({type, startData, onSubmit: handleSubmit}) => {

    const globalError = useSelector(selector.authErrors())
    const initialData = Object.keys(startData).length ? {...defaultData, ...startData} : defaultData

    const [data, setData] = useState(initialData)
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

    function onChange ({name, value}) {
        setData(prevState => ({...prevState, [name]: value}))
    }

    async function onSubmit (event) {
        event.preventDefault()
        const isValid = validate()
        if (!isValid) return
        handleSubmit(data)
    }

    const isValid = Object.keys(errors).length === 0

    // console.log(data, errors)

    return (
        <form className="aa" onSubmit={onSubmit}>
            {globalError && <div className="alert alert-danger">{globalError}</div>}
            <TextField
                label="Имя"
                type="text"
                name="name"
                value={data.name}
                error={errors.name}
                onChange={onChange}
            />
            <RadioField
                label="Выберите ваш пол"
                name="sex"
                value={data.sex}
                error={errors.sex}
                options={sexVariants}
                onChange={onChange}
            />
            <TextField
                label="Электронная почта"
                type="text"
                name="email"
                value={data.email}
                error={errors.email}
                onChange={onChange}
            />
            <CheckboxField
                label=""
                name="license"
                value={data.license}
                required={true}
                error={errors.license}
                onChange={onChange}
            >
                Согласен на обработку персональных данных
            </CheckboxField>
            <button className="btn btn-primary w-100 mx-auto" type="submit" disabled={!isValid}>Отправить</button>
        </form>
    )
}

UserForm.defaultProps = {
    type: 'create',
    startData: {},
}

UserForm.propTypes = {
    type: PropTypes.string,
    startData: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
}

export default UserForm
