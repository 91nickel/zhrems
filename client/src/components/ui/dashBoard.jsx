import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
// import * as yup from 'yup'
// import TextField from 'components/common/form/textField'
// import CheckboxField from 'components/common/form/checkboxField'
import DashboardWeight from 'components/ui/weight/dashboardWeight'
import TransactionCard from 'components/ui/transaction/card'
import { selector, action } from 'store/transaction'
import { selector as weightSelector, action as weightAction } from 'store/weight'
import { selector as dateSelector, action as dateAction } from 'store/date'
import LoadingLayout from 'layouts/loading'
import { getDateStart, getDateEnd } from 'utils/date'
import PropTypes from 'prop-types'
import Card from './weight/card'

const Dashboard = () => {
    const params = useParams()
    const dispatch = useDispatch()

    // const [errors, setErrors] = useState({})
    // const isLoggedIn = useSelector(getUsersIsAuthorized())
    const currentDate = useSelector(dateSelector.get())
    const prevDate = useSelector(dateSelector.prev())
    const nextDate = useSelector(dateSelector.next())
    const dayTransactions = useSelector(selector.byDate(currentDate))
    const transactionsGrouped = useSelector(selector.byDateGrouped(currentDate))
    const timeline = createTimeline()

    const dateString = currentDate.toLocaleString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    const results = {
        proteins: dayTransactions.reduce((agr, data) => Math.round(agr + data.weight * data.proteins / 100), 0),
        fats: dayTransactions.reduce((agr, data) => Math.round(agr + data.weight * data.fats / 100), 0),
        carbohydrates: dayTransactions.reduce((agr, data) => Math.round(agr + data.weight * data.carbohydrates / 100), 0),
        calories: dayTransactions.reduce((agr, data) => Math.round(agr + data.weight * data.calories / 100), 0),
        weight: dayTransactions.reduce((agr, data) => Math.round(agr + data.weight), 0),
    }

    function createTimeline () {
        const timeline = {}
        let times = new Array(48)
            .fill(new Date())
            .map((date, i) => {
                date.setTime(getDateStart(currentDate).getTime() + 30 * 60 * 1000 * i)
                return new Date(date)
            })
        const transactionDates = Object.keys(transactionsGrouped)
            .map(dateStr => new Date(dateStr))
        transactionDates.forEach(date => {
            times = times.filter(time => {
                if (Math.abs(+date - +time) < 30 * 60 * 1000 || Math.abs(+time - +date) < 30 * 60 * 1000)
                    return false
                return true
            })
        })
        times = times.concat(transactionDates)

        console.log(times)
        // const transactions = transactionsGrouped.map(t => console.log(t))
        return timeline
    }

    function onDeleteTransaction (date) {
        // console.log('onDelete', date, transactions)
        dayTransactions.forEach(t => {
            if (date === t.date)
                dispatch(action.delete(t._id))
        })
    }

    function onDeleteWeight (id) {
        // console.log('onDeleteWeight', id)
        dispatch(weightAction.delete(id))
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
                <DashboardWeight type="start" onDelete={onDeleteWeight}/>
                {
                    Object.values(transactionsGrouped)
                        .map((t, i) =>
                            <TransactionCard key={'tr-' + i} data={t} onDelete={onDeleteTransaction}/>)
                }
                <DashboardWeight type="end" onDelete={onDeleteWeight}/>
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
