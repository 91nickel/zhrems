import React from 'react'
import { Navigate, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selector } from 'store/user'
import SignUpForm from 'components/ui/form/signUpForm'

const SignUp = () => {

    const isAuthorized = useSelector(selector.isAuthorized())

    if (isAuthorized === true)
        return <Navigate to="/dashboard" replace={true}/>

    return (
        <div className="row justify-content-center mt-3">
            <div className="col-12 col-md-6 col-lg-4">
                <h2>Регистрация</h2>
                <SignUpForm />
                <p>Already have account? <NavLink to="../signIn" role="button">Sign In</NavLink></p>
            </div>
        </div>
    )
}

export default SignUp
