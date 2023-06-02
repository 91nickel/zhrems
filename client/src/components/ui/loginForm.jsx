import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import * as yup from 'yup'

import TextField from 'components/common/form/textField'
import CheckboxField from 'components/common/form/checkboxField'
import { getAuthErrors, getUsersIsAuthorized, signIn } from 'store/user'

const LoginForm = () => {
    const dispatch = useDispatch()
    const [data, setData] = useState({email: '', password: '', stayOn: false})
    const globalError = useSelector(getAuthErrors())
    const [errors, setErrors] = useState({})
    const isLoggedIn = useSelector(getUsersIsAuthorized())
    const navigate = useNavigate()

    if (isLoggedIn) {
        return <Navigate to="/" replace={true}/>
    }

    const validateScheme = yup.object().shape({
        password: yup.string()
            .required('Пароль обязателен для заполнения')
            .matches(/^(?=.*[A-Z])/, 'Пароль должен содержать хотя бы одну заглавную букву')
            .matches(/^(?=.*[0-9])/, 'Пароль должен содержать хотя бы одну цифру')
            .matches(/^(?=.{8,})/, 'Минимальная длина пароля - 8 символов'),
        email: yup.string().required('Электронная почта обязательна для заполнения').email('Электронная почта указана в неверном формате'),
    })

    useEffect(() => {
        validate()
    }, [data])

    function validate () {
        validateScheme.validate(data)
            .then(() => setErrors({}))
            .catch(err => setErrors({[err.path]: err.message}))
        return Object.keys(errors).length === 0
    }

    const handleChange = (target) => {
        setData(prevState => (
            {
                ...prevState,
                [target.name]: target.value,
            }
        ))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const isValid = validate()
        if (!isValid) return
        dispatch(signIn({payload: data}))
            .then(() => {
                navigate('/', {replace: true})
            })
    }

    const isValid = Object.keys(errors).length === 0

    return (
        <form className="aa" onSubmit={handleSubmit}>
            {globalError && <div className="alert alert-danger">{globalError}</div>}
            <TextField
                label="Электронная почта"
                type="text"
                name="email"
                value={data.email}
                error={errors.email}
                onChange={handleChange}/>
            <TextField
                label="Пароль"
                type="password"
                name="password"
                value={data.password}
                error={errors.password}
                onChange={handleChange}/>
            <CheckboxField
                label=""
                name="stayOn"
                value={data.stayOn}
                error={errors.stayOn}
                onChange={handleChange}
            >
                Запомнить меня
            </CheckboxField>
            {/*{globalError && <p className="text-danger">{globalError}</p>}*/}
            <button className="btn btn-primary w-100 mx-auto" type="submit" disabled={!isValid}>Отправить</button>
        </form>
    )
}

export default LoginForm
