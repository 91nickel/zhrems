import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'

import TextField from 'components/common/form/textField'
import CheckboxField from 'components/common/form/checkboxField'
import { getAuthErrors, signIn } from 'store/user'

const LoginForm = () => {
    const dispatch = useDispatch()
    const [data, setData] = useState({email: '', password: '', stayOn: false})
    const globalError = useSelector(getAuthErrors())
    const [errors, setErrors] = useState({})

    useEffect(() => {
        validate()
    }, [data])

    const handleChange = (target) => {
        setData(prevState => (
            {
                ...prevState,
                [target.name]: target.value,
            }
        ))
    }

    // const validatorConfig = {
    //     email: {
    //         isRequired: {
    //             message: 'Электронная почта обязательна для заполнения'
    //         },
    //         isEmail: {
    //             message: 'Электронная почта указана в неверном формате'
    //         },
    //     },
    //     password: {
    //         isRequired: {
    //             message: 'Пароль обязателен для заполнения'
    //         },
    //         isCapitalSymbol: {
    //             message: 'Пароль должен содержать хотя бы одну заглавную букву'
    //         },
    //         isContainDigit: {
    //             message: 'Пароль должен содержать хотя бы одну цифру'
    //         },
    //         min: {
    //             message: 'Минимальная длина пароля - #value# символов',
    //             value: 8,
    //         },
    //     },
    // }

    const validateScheme = yup.object().shape({
        password: yup.string()
            .required('Пароль обязателен для заполнения')
            .matches(/^(?=.*[A-Z])/, 'Пароль должен содержать хотя бы одну заглавную букву')
            .matches(/^(?=.*[0-9])/, 'Пароль должен содержать хотя бы одну цифру')
            // .matches(/^(?=.*[!"№$%^&*\-_])/, 'Пароль должен содержать хотя бы один спецсимвол')
            .matches(/^(?=.{8,})/, 'Минимальная длина пароля - 8 символов'),
        email: yup.string().required('Электронная почта обязательна для заполнения').email('Электронная почта указана в неверном формате'),
    })


    const handleSubmit = (event) => {
        event.preventDefault()
        const isValid = validate()
        if (!isValid) return
        // const redirect = history.location?.state?.from?.pathname
        //     ? history.location.state.from.pathname
        //     : '/'
        dispatch(signIn({payload: data, redirect}))
    }

    const validate = () => {
        // const errors = validator(data, validatorConfig)
        validateScheme.validate(data)
            .then(() => setErrors({}))
            .catch(err => setErrors({[err.path]: err.message}))
        // setErrors(errors)
        return Object.keys(errors).length === 0
    }

    const isValid = Object.keys(errors).length === 0

    return (
        <form className="aa" onSubmit={handleSubmit}>
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
            {globalError && <p className="text-danger">{globalError}</p>}
            <button className="btn btn-primary w-100 mx-auto" type="submit" disabled={!isValid}>Отправить</button>
        </form>
    )
}

export default LoginForm
