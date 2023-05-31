/* eslint-disable */
import React from 'react'
import { NavLink } from 'react-router-dom'
import RegisterForm from 'components/ui/registerForm'

const RegisterLayout = () => {
    return (
        <div className="row justify-content-center mt-3">
            <div className="col-12 col-md-6 col-lg-4">
                <h2>Регистрация</h2>
                <RegisterForm />
                <p>Already have account? <NavLink to="../signin" role="button">Sign In</NavLink></p>
            </div>
        </div>
    )
}

export default RegisterLayout
