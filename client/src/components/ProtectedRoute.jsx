import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getUsersIsAuthorized } from 'store/user'
import PropTypes from 'prop-types'

function ProtectedRoute ({redirectTo, children}) {
    const location = useLocation()
    const isLoggedIn = useSelector(getUsersIsAuthorized())
    if (!isLoggedIn) {
        return <Navigate to="/auth/signin" state={{referer: redirectTo ? redirectTo : location}}/>
    }
    return children
}

ProtectedRoute.propTypes = {
    redirectTo: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
}

export default ProtectedRoute
