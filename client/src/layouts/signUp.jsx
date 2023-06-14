import React from 'react'
import { NavLink } from 'react-router-dom'
import Form from 'components/ui/auth/signUp'

const SignUp = () => {
    return (
        <div className="row justify-content-center mt-3">
            <div className="col-12 col-md-6 col-lg-4">
                <h2>Регистрация</h2>
                <Form />
                <p>Already have account? <NavLink to="../signIn" role="button">Sign In</NavLink></p>
            </div>
        </div>
    )
}

export default SignUp
