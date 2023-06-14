import React from 'react'
import { NavLink } from 'react-router-dom'
import Form from 'components/ui/auth/signIn'
import PropTypes from 'prop-types'

const SignIn = ({children}) => {
    return (
        <div className="row justify-content-center mt-3">
            <div className="col-12 col-md-6 col-lg-4">
                <h2>Авторизация</h2>
                <Form/>
                <p>Dont have account? <NavLink to="../signUp" role="button">Sign Up</NavLink></p>
            </div>
        </div>
    )
}

SignIn.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
}

export default SignIn
