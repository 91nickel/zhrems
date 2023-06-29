import React, { useEffect } from 'react'
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selector as authSelector } from 'store/user'
import { selector, action } from 'store/transaction'
import TransactionsGroup from 'components/ui/dashboard/transactionsGroup'
import LoadingLayout from 'layouts/loading'

const View = () => {
    const params = useParams()
    const date = new Date(params.date)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const journal = useSelector(selector.journal())
    const transactions = useSelector(selector.byDate(date))

    useEffect(() => {
        if (typeof journal[date.toLocaleDateString('fr-CA')] === 'undefined')
            dispatch(action.getByDate(date))
    }, [])

    if (typeof journal[date.toLocaleDateString('fr-CA')] === 'undefined')
        return <LoadingLayout/>

    console.log('transactions', transactions, journal)

    const onDelete = () => {
        dispatch(action.delete(params.date))
            .unwrap()
            .then(() => navigate('..'))
            .catch(error => console.error(error.message))
    }

    return (
        <div className="row justify-content-center">
            <div className="col-12 col-md-6 mt-5 d-flex justify-content-between">
                <NavLink to="../.." className="btn btn-primary">
                    <i className="bi bi-caret-left"/>
                    Назад
                </NavLink>
            </div>
            <div className="w-100"></div>
            <div className="col-12 col-md-6 mt-5">
                <TransactionsGroup {...{data: transactions, onDelete}} />
            </div>
        </div>
    )
}

export default View
