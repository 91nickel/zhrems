import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selector } from 'store/user'
import Layout from 'layouts'
import PropTypes from 'prop-types'

function ProtectedRoute ({redirectTo, admin, children}) {
    const location = useLocation()
    const isLoggedIn = useSelector(selector.isAuthorized())
    const {isAdmin} = useSelector(selector.authData())

    if (isLoggedIn === false) {
        return <Navigate to="/auth/signIn" state={{referer: redirectTo ? redirectTo : location}}/>
    }
    if (admin && isAdmin === false) {
        return <Layout.Forbidden />
    }
    return children
}

ProtectedRoute.defaultValue = {
    admin: false,
}

ProtectedRoute.propTypes = {
    redirectTo: PropTypes.string,
    admin: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
}

export default ProtectedRoute