import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import * as yup from 'yup'

import TextField from 'components/common/form/textField'
import CheckboxField from 'components/common/form/checkboxField'
import { action, selector } from 'store/user'

const validateScheme = yup.object().shape({
    password: yup.string()
        .required('Пароль обязателен для заполнения')
        .matches(/^(?=.*[A-Z])/, 'Пароль должен содержать хотя бы одну заглавную букву')
        .matches(/^(?=.*[0-9])/, 'Пароль должен содержать хотя бы одну цифру')
        .matches(/^(?=.{8,})/, 'Минимальная длина пароля - 8 символов'),
    email: yup.string().required('Электронная почта обязательна для заполнения').email('Электронная почта указана в неверном формате'),
})

const SignInForm = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const globalError = useSelector(selector.authErrors())

    const [data, setData] = useState({email: '', password: '', stayOn: false})
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
        await dispatch(action.signIn(data)).unwrap()
        navigate('/', {replace: true})
    }

    const isValid = Object.keys(errors).length === 0

    return (
        <form className="aa" onSubmit={onSubmit}>
            {globalError && <div className="alert alert-danger">{globalError}</div>}
            <TextField
                label="Электронная почта"
                type="text"
                name="email"
                value={data.email}
                error={errors.email}
                onChange={onChange}/>
            <TextField
                label="Пароль"
                type="password"
                name="password"
                value={data.password}
                error={errors.password}
                onChange={onChange}/>
            <CheckboxField
                label=""
                name="stayOn"
                value={data.stayOn}
                error={errors.stayOn}
                onChange={onChange}
            >
                Запомнить меня
            </CheckboxField>
            <button className="btn btn-primary w-100 mx-auto" type="submit" disabled={!isValid}>Отправить</button>
        </form>
    )
}

export default SignInForm
