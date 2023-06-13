import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import LoadingLayout from 'layouts/loading'
import { action, selector } from 'store/user'

const UserLoader = ({children}) => {
    // const {id} = useParams()
    const dispatch = useDispatch()

    // const user = useSelector(selector.byId(id))
    const usersLoaded = useSelector(selector.isDataLoaded())

    useEffect(() => {
        dispatch(action.get())
    }, [])

    if (!usersLoaded)
        return <LoadingLayout/>

    return children
}

UserLoader.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
}
export default UserLoader