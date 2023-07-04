import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import TextField from 'components/common/form/textField'
import CheckboxField from 'components/common/form/checkboxField'
import RadioField from 'components/common/form/radioField'
import { action, selector } from 'store/user'

import { validator } from 'utils/validator'

const SignUpForm = () => {
    const dispatch = useDispatch()
    const [data, setData] = useState({name: '', sex: 'male', email: '', password: '', license: false})
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()
    const globalError = useSelector(selector.authErrors())

    useEffect(() => {
        validate()
    }, [data])

    const validatorConfig = {
        email: {
            isRequired: {message: 'Электронная почта обязательна для заполнения'},
            isEmail: {message: 'Электронная почта указана в неверном формате'},
        },
        name: {
            isRequired: {message: 'Имя обязательно для заполнения'},
            min: {message: 'Минимальная длина имени - #value# символа', value: 3},
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

    function onChange ({name, value}) {
        setData(prevState => ({...prevState, [name]: value}))
    }

    async function onSubmit (event) {
        event.preventDefault()
        const isValid = validate()
        if (!isValid) return
        await dispatch(action.signUp(data))
        navigate('/', {replace: true})
    }

    function validate () {
        const errors = validator(data, validatorConfig)
        setErrors(errors)
        return Object.keys(errors).length === 0
    }

    const isValid = Object.keys(errors).length === 0

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
                options={[
                    {name: 'Male', value: 'male'},
                    {name: 'Female', value: 'female'},
                    {name: 'Other', value: 'other'},
                ]}
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
            <TextField
                label="Пароль"
                type="password"
                name="password"
                value={data.password}
                error={errors.password}
                onChange={onChange}
            />
            <CheckboxField
                label="Согласие с лицензионным соглашением"
                name="license"
                value={data.license}
                required={true}
                error={errors.license}
                onChange={onChange}
            >
                Согласен с <a href="#">лицензионным соглашением</a>
            </CheckboxField>
            <button className="btn btn-primary w-100 mx-auto" type="submit" disabled={!isValid}>Отправить</button>
        </form>
    )
}

export default SignUpForm
