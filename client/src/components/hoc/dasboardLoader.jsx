import React, { useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import LoadingLayout from 'layouts/loading'
import { action as userAction, selector as userSelector } from 'store/user'
import { action as dateAction, selector as dateSelector } from 'store/date'
import { action as feedAction, selector as feedSelector } from 'store/feed'
import { action as weightAction, selector as weightSelector } from 'store/weight'

const DashboardLoader = ({children}) => {
    const {date} = useParams()
    const dispatch = useDispatch()
    const journal = useSelector(feedSelector.journal())
    const currentDate = useSelector(dateSelector.get())
    // const prevDate = useSelector(dateSelector.prev())
    // const nextDate = useSelector(dateSelector.next())
    const isFeedsLoading = useSelector(feedSelector.isLoading())
    // const isWeightsLoading = useSelector(weightSelector.isLoading())

    useEffect(() => {
        // console.log('journal', journal, date, currentDate, isTransactionsLoading)
        if (date)
            dispatch(dateAction.set(new Date(date)))
        if (typeof journal[date] === 'undefined' && !isFeedsLoading)
            dispatch(feedAction.getByDate(new Date(date)))
    }, [date])

    if (!date)
        return <Navigate to={currentDate.toLocaleDateString('fr-CA')} />

    if (typeof journal[currentDate.toLocaleDateString('fr-CA')] === 'undefined')
        return <LoadingLayout/>

    return children
}

DashboardLoader.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
}
export default DashboardLoader