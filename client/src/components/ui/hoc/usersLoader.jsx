import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import { getUsersIsDataLoaded, loadUsersList } from 'store/user'

const UsersLoader = ({children}) => {
    const dispatch = useDispatch()
    const isUsersLoaded = useSelector(getUsersIsDataLoaded())
    useEffect(() => {
        if (!isUsersLoaded)
            dispatch(loadUsersList())
    }, [])
    if (!isUsersLoaded)
        return 'Users loading...'
    return children
}

UsersLoader.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
}
export default UsersLoader