import React from 'react'
import { Navigate, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selector } from 'store/user'
import SignInForm from 'components/ui/form/signInForm'

const SignIn = () => {

    const isAuthorized = useSelector(selector.isAuthorized())

    if (isAuthorized === true)
        return <Navigate to="/dashboard" replace={true}/>

    return (
        <div className="row justify-content-center mt-3">
            <div className="col-12 col-md-6 col-lg-4">
                <h2>Авторизация</h2>
                <SignInForm/>
                <p>Dont have account? <NavLink to="../signUp" role="button">Sign Up</NavLink></p>
            </div>
        </div>
    )
}

export default SignIn
