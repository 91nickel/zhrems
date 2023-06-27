import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
// import * as yup from 'yup'
// import TextField from 'components/common/form/textField'
// import CheckboxField from 'components/common/form/checkboxField'
import FirstDayWeight from 'components/ui/weight/firstDayWeight'
import LastDayWeight from 'components/ui/weight/lastDayWeight'
import TransactionCard from 'components/ui/transaction/card'
import { selector, action } from 'store/transaction'
import { selector as weightSelector, action as weightAction } from 'store/weight'
import { selector as dateSelector, action as dateAction } from 'store/date'
import LoadingLayout from 'layouts/loading'
import { getDateStart, getDateEnd } from 'utils/date'
import PropTypes from 'prop-types'
import Card from './weight/card'
import { groupTransactions } from '../../utils/groupTransactions'
import { groupDayTransactions } from '../../utils/groupDayTransactions'

const Dashboard = () => {
    const params = useParams()
    const dispatch = useDispatch()

    // const [errors, setErrors] = useState({})
    // const isLoggedIn = useSelector(getUsersIsAuthorized())
    const currentDate = useSelector(dateSelector.get())
    const prevDate = useSelector(dateSelector.prev())
    const nextDate = useSelector(dateSelector.next())
    const dayTransactions = useSelector(selector.byDate(currentDate))
    // const transactionsGrouped = groupDayTransactions(dayTransactions)
    const transactionsGrouped = useSelector(selector.byDateGrouped(currentDate))

    // const dateStart = getDateStart(currentDate)
    // const dateEnd = getDateEnd(currentDate)

    const dateString = currentDate.toLocaleString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })


    // console.log(transactionsGrouped)

    const lastWeight = useSelector(weightSelector.last())
    const todayWeights = useSelector(weightSelector.byDate(currentDate))
    const firstTodayWeight = todayWeights.length ? todayWeights[0] : null
    const lastTodayWeight = todayWeights.length ? todayWeights[todayWeights.length - 1] : null
    const hasTodayWeights = todayWeights.length > 0
    // const products = transactions.reduce((agr, transaction) => ([...agr, ...transaction.products]), [])

    const results = {
        proteins: dayTransactions.reduce((agr, data) => Math.round(agr + data.weight * data.proteins / 100), 0),
        fats: dayTransactions.reduce((agr, data) => Math.round(agr + data.weight * data.fats / 100), 0),
        carbohydrates: dayTransactions.reduce((agr, data) => Math.round(agr + data.weight * data.carbohydrates / 100), 0),
        calories: dayTransactions.reduce((agr, data) => Math.round(agr + data.weight * data.calories / 100), 0),
        weight: dayTransactions.reduce((agr, data) => Math.round(agr + data.weight), 0),
    }

    const onDelete = date => {
        // console.log('onDelete', date, transactions)
        dayTransactions.forEach(t => {
            if (date === t.date)
                dispatch(action.delete(t._id))
        })
    }

    return (<>
        <div className="row justify-content-center my-3">
            <div className="col-1 d-flex justify-content-start">
                <NavLink
                    to={`../${prevDate.toLocaleDateString('fr-CA')}`}
                    className="btn btn-success w-50"
                >
                    <i className="bi bi-arrow-left"></i>
                </NavLink>
            </div>
            <div className="col-10 col-md-4 d-flex justify-content-center">
                <h3>{dateString}</h3>
            </div>
            <div className="col-1 d-flex justify-content-end">
                <NavLink
                    to={`../${nextDate.toLocaleDateString('fr-CA')}`}
                    className="btn btn-success w-50"
                >
                    <i className="bi bi-arrow-right"></i>
                </NavLink>
            </div>
        </div>
        <div className="row justify-content-center mb-3">
            <div className="col-6 col-md-3">
                <NavLink className="btn btn-primary w-100" to="/weights/create">Взвеситься</NavLink>
            </div>
            <div className="col-6 col-md-3">
                <NavLink className="btn btn-success w-100" to="/transactions/create">Поесть</NavLink>
            </div>
        </div>
        <div className="row justify-content-center mb-3">
            <div className="col-12 col-md-6">
                <FirstDayWeight/>
                {
                    Object.values(transactionsGrouped)
                        .map((t, i) =>
                            <TransactionCard key={'tr-' + i} data={t} onDelete={onDelete}/>)
                }
                <LastDayWeight />
            </div>
        </div>
        <div className="row justify-content-center mb-3">
            <div className="col-12 col-md-6">
                <p className="d-flex justify-content-between">
                    <span>Потребление за день:</span>
                    <span>
                        <span className="badge bg-info mx-1">{results.proteins} г</span>
                        <span className="badge bg-warning mx-1">{results.fats} г</span>
                        <span className="badge bg-success mx-1">{results.carbohydrates} г</span>
                        <span className="badge bg-danger mx-1">{results.calories} кКал</span>
                        <span className="badge bg-dark mx-1">{results.weight} г</span>
                    </span>
                </p>
            </div>
        </div>
    </>)
}

Dashboard.propTypes = {
    // datestr: PropTypes.string,
}

export default Dashboard
