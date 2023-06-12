import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import LoadingLayout from 'layouts/loading'
import { action as userAction, selector as userSelector } from 'store/user'
import { action as productAction, selector as productSelector } from 'store/product'

const AppLoader = ({children}) => {

    const dispatch = useDispatch()
    const isAuthorized = useSelector(userSelector.isAuthorized())
    const isProcessingAuth = useSelector(userSelector.isProcessingAuth())
    const isProductsLoading = useSelector(productSelector.isLoading())
    // const isUsersLoaded = useSelector(getUsersIsDataLoaded())

    useEffect(() => {
        dispatch(userAction.setAuth())
    }, [])

    useEffect(() => {
        if (isAuthorized === true)
            dispatch(productAction.get())
        if (isAuthorized === true)
            dispatch(productAction.get())
    }, [isAuthorized])

    if (isProcessingAuth || isProductsLoading)
        return <LoadingLayout/>

    return children
}

AppLoader.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
}
export default AppLoader