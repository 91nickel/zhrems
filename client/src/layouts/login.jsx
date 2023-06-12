import React from 'react'
import { NavLink } from 'react-router-dom'
import LoginForm from 'components/ui/loginForm'
import PropTypes from 'prop-types'

const Login = ({children}) => {
    return (
        <div className="row justify-content-center mt-3">
            <div className="col-12 col-md-6 col-lg-4">
                <h2>Авторизация</h2>
                <LoginForm/>
                <p>Dont have account? <NavLink to="../signup" role="button">Sign Up</NavLink></p>
            </div>
        </div>
    )
}

Login.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
}

export default Login
