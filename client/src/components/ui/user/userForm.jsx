import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import TextField from 'components/common/form/textField'
import RadioField from 'components/common/form/radioField'
import CheckboxField from 'components/common/form/checkboxField'
import { selector } from 'store/user'
import { validator } from 'utils/validator'
import PropTypes from 'prop-types'

const UserForm = ({onSubmit}) => {
    const {id} = useParams()

    const defaultFields = {name: '', sex: 'male', email: '', password: '', license: false}
    const user = useSelector(selector.byId(id))
    Object.keys(defaultFields).forEach(key => {
        if (typeof user[key] !== 'undefined')
            defaultFields[key] = user[key]
    })
    const [data, setData] = useState(defaultFields)

    const [errors, setErrors] = useState({})
    const globalError = useSelector(selector.authErrors())

    useEffect(() => {
        validate()
    }, [data])

    const validatorConfig = {
        name: {
            isRequired: {message: 'Имя обязательно для заполнения'},
            min: {message: 'Минимальная длина имени - #value# символа', value: 3},
        },
        email: {
            isRequired: {message: 'Электронная почта обязательна для заполнения'},
            isEmail: {message: 'Электронная почта указана в неверном формате'},
        },
        password: {
            isRequired: {message: 'Пароль обязателен для заполнения'},
            min: {message: 'Минимальная длина пароля - #value# символов', value: 8},
            isCapitalSymbol: {message: 'Пароль должен содержать хотя бы одну заглавную букву'},
            isContainDigit: {message: 'Пароль должен содержать хотя бы одну цифру'},
        },
        sex: {
            isRequired: {message: 'Необходимо выбрать пол'},
        },
        license: {
            isRequired: {message: 'Вы не можете использовать наш сервис без подтверждения'},
        },
    }

    const handleChange = (target) => {
        setData(prevState => (
            {...prevState, [target.name]: target.value}
        ))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const isValid = validate()
        if (!isValid) return
        onSubmit(data)
    }

    function validate () {
        const errors = validator(data, validatorConfig)
        setErrors(errors)
        return Object.keys(errors).length === 0
    }

    const isValid = Object.keys(errors).length === 0
    return (
        <form className="aa" onSubmit={handleSubmit}>
            {globalError && <div className="alert alert-danger">{globalError}</div>}
            <TextField
                label="Имя"
                type="text"
                name="name"
                value={data.name}
                error={errors.name}
                onChange={handleChange}
            />
            <RadioField
                label="Выберите ваш пол"
                name="sex"
                value={data.sex}
                error={errors.sex}
                options={[
                    {name: 'Male', value: 'male'},
                    {name: 'Female', value: 'female'},
                    {name: 'Other', value: 'other'},
                ]}
                onChange={handleChange}
            />
            <TextField
                label="Электронная почта"
                type="text"
                name="email"
                value={data.email}
                error={errors.email}
                onChange={handleChange}
            />
            <TextField
                label="Пароль"
                type="password"
                name="password"
                value={data.password}
                error={errors.password}
                onChange={handleChange}
            />
            <CheckboxField
                label="Согласие с лицензионным соглашением"
                name="license"
                value={data.license}
                required={true}
                error={errors.license}
                onChange={handleChange}
            >
                Согласен с <a href="#">лицензионным соглашением</a>
            </CheckboxField>
            <button className="btn btn-primary w-100 mx-auto" type="submit" disabled={!isValid}>Отправить</button>
        </form>
    )
}
UserForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
}

export default UserForm
