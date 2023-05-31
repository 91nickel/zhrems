import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { loadQualitiesList } from 'store/quality'
import { loadProfessionsList } from 'store/profession'
import {
    getUsersIsAuthorized,
    getUsersIsLoading,
    getUsersIsDataLoaded,
    getUsersIsProcessingAuth,
    loadUsersList,
    setAuth
} from 'store/user'

const AppLoader = ({children}) => {

    const dispatch = useDispatch()
    const isAuthorized = useSelector(getUsersIsAuthorized())
    const isUsersLoading = useSelector(getUsersIsLoading())
    const isUsersLoaded = useSelector(getUsersIsDataLoaded())
    const isProcessingAuth = useSelector(getUsersIsProcessingAuth())

    useEffect(() => {
        dispatch(loadQualitiesList())
        dispatch(loadProfessionsList())
        dispatch(setAuth())
    }, [])

    useEffect(() => {
        if (isAuthorized && !isUsersLoaded)
            dispatch(loadUsersList())
    }, [isAuthorized])

    // console.log(isProcessingAuth, isAuthorized, isUsersLoaded)

    if (isProcessingAuth || (isAuthorized && !isUsersLoaded))
        return 'App loading...'

    return children
}

AppLoader.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
}
export default AppLoader