import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { getUsersIsAuthorized, getUsersIsProcessingAuth } from 'store/user'

const ProtectedRoute = ({component: Component, children, ...rest}) => {

    const isProcessingAuth = useSelector(getUsersIsProcessingAuth())
    const isAuthorized = useSelector(getUsersIsAuthorized())

    const render = (props) => {
        if (isProcessingAuth)
            return 'Auth processing...'
        if (!isAuthorized) {
            return <Redirect to={{pathname: '/login', state: {from: props.location}}}/>
        }
        return Component ? <Component {...props} /> : children
    }

    return <Route {...rest} render={render}/>
}

ProtectedRoute.propTypes = {
    component: PropTypes.func,
    location: PropTypes.object,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node)
    ])
}

export default ProtectedRoute
