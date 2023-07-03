import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import LoadingLayout from 'layouts/loading'
import { action as userAction, selector as userSelector } from 'store/user'
import { action as productAction, selector as productSelector } from 'store/product'
import { action as sectionAction, selector as sectionSelector } from 'store/section'
import { action as mealAction, selector as mealSelector } from 'store/meal'
import { action as weightAction, selector as weightSelector } from 'store/weight'

const AppLoader = ({children}) => {

    const dispatch = useDispatch()
    const isAuthorized = useSelector(userSelector.isAuthorized())
    const isProcessingAuth = useSelector(userSelector.isProcessingAuth())
    const isProductsLoading = useSelector(productSelector.isLoading())
    const isSectionsLoading = useSelector(sectionSelector.isLoading())
    const isMealsLoading = useSelector(mealSelector.isLoading())
    const isWeightsLoading = useSelector(weightSelector.isLoading())
    // const isUsersLoaded = useSelector(getUsersIsDataLoaded())

    useEffect(() => {
        dispatch(userAction.setAuth())
    }, [])

    useEffect(() => {
        if (isAuthorized === true) {
            dispatch(productAction.get())
            dispatch(sectionAction.get())
            dispatch(weightAction.get())
            dispatch(mealAction.get())
        }
    }, [isAuthorized])

    if (isProcessingAuth || isWeightsLoading || isProductsLoading || isSectionsLoading || isMealsLoading)
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