import React, { useEffect } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selector, action } from 'store/transaction'
import { selector as authSelector } from 'store/user'
import Form from 'components/ui/transaction/form'
import LoadingLayout from 'layouts/loading'

const Update = () => {
    const params = useParams()
    const date = new Date(params.date)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const journal = useSelector(selector.journal())
    const allTransactions = useSelector(selector.byDate(date))

    useEffect(() => {
        if (typeof journal[date.toLocaleDateString('ru-RU')] === 'undefined')
            dispatch(action.getByDate(date))
    }, [])

    if (typeof journal[date.toLocaleDateString('ru-RU')] === 'undefined')
        return <LoadingLayout/>

    // console.log('transactions', allTransactions, journal)

    let transaction = {}
    allTransactions.forEach(t => {
        if (!Object.values(transaction).length) {
            transaction = {date: params.date, user: t.user, products: []}
        }
        if (params.date === t.date)
            transaction.products.push(t)
    })

    const onSubmit = payload => {
        dispatch(action.update(payload))
            .unwrap()
            .then(() => {
                setTimeout(() => navigate('../..', {replace: true}), 1000)
            })
            .catch(() => {
                console.log('Failed')
            })
    }

    return (
        <div className="row justify-content-center">
            <div className="col-12 col-md-6 mt-5">
                <NavLink to="../.." className="btn btn-primary">
                    <i className="bi bi-caret-left"/>
                    Назад
                </NavLink>
            </div>
            <div className="w-100"></div>
            <div className="col-12 col-md-6 mt-5">
                <Form onSubmit={onSubmit}/>
            </div>
        </div>
    )
}

export default Update
