import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
// import * as yup from 'yup'
// import TextField from 'components/common/form/textField'
// import CheckboxField from 'components/common/form/checkboxField'
import TransactionCard from 'components/ui/transaction/card'
import { selector, action } from 'store/transaction'
import { selector as weightSelector, action as weightAction } from 'store/weight'
import LoadingLayout from 'layouts/loading'
import {getDateStart, getDateEnd} from 'utils/date'

const Dashboard = () => {
    const dispatch = useDispatch()
    // const [data, setData] = useState({email: '', password: '', stayOn: false})
    // const [errors, setErrors] = useState({})
    // const isLoggedIn = useSelector(getUsersIsAuthorized())
    const [currentDate] = useState(new Date()) // дата сегодня
    const [date, setDate] = useState(new Date()) // дата, с которой работаем
    const dateStart = getDateStart(date)
    const dateEnd = getDateEnd(date)

    const prevDateActive = true
    const nextDateActive =
        currentDate.getFullYear() !== date.getFullYear()
        || currentDate.getMonth() !== date.getMonth()
        || currentDate.getDate() !== date.getDate()

    const dateString = date.toLocaleString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    const journal = useSelector(selector.journal())
    const transactions = useSelector(selector.byDate(date))
    const lastWeight = useSelector(weightSelector.last())
    const todayWeights = useSelector(weightSelector.byDate(date))
    const firstTodayWeight = todayWeights.length ? todayWeights[0] : null
    const lastTodayWeight = todayWeights.length ? todayWeights[todayWeights.length - 1] : null
    const hasTodayWeights = todayWeights.length > 0
    const products = transactions.reduce((agr, transaction) => ([...agr, ...transaction.products]), [])

    const results = {
        proteins: products.reduce((agr, data) => Math.round(agr + data.weight * data.proteins / 100), 0),
        fats: products.reduce((agr, data) => Math.round(agr + data.weight * data.fats / 100), 0),
        carbohydrates: products.reduce((agr, data) => Math.round(agr + data.weight * data.carbohydrates / 100), 0),
        calories: products.reduce((agr, data) => Math.round(agr + data.weight * data.calories / 100), 0),
        weight: products.reduce((agr, data) => Math.round(agr + data.weight), 0),
    }

    useEffect(() => {
        if (typeof journal[date.toLocaleDateString('ru-RU')] === 'undefined')
            dispatch(action.getByDate(date))
    }, [date])

    if (typeof journal[date.toLocaleDateString('ru-RU')] === 'undefined')
        return <LoadingLayout/>

    console.log('transactions', transactions, journal)

    // if (isLoggedIn) {
    //     return <Navigate to="/" replace={true}/>
    // }

    function onChangeDate (days) {
        setDate(prevDate => {
            prevDate.setDate(prevDate.getDate() + days)
            return new Date(prevDate.getTime())
        })
    }

    const onDelete = (id) => {
        dispatch(action.delete(id))
            .unwrap()
            .then()
            .catch(error => console.error(error.message))
    }

    return (<>
        <div className="row justify-content-center my-3">
            <div className="col-1 d-flex justify-content-start">
                <button
                    className="btn btn-success w-50"
                    onClick={() => onChangeDate(-1)}
                    disabled={!prevDateActive}
                >
                    <i className="bi bi-arrow-left"></i>
                </button>
            </div>
            <div className="col-10 col-md-4 d-flex justify-content-center">
                <h3>{dateString}</h3>
            </div>
            <div className="col-1 d-flex justify-content-end">
                <button
                    className="btn btn-success w-50"
                    onClick={() => onChangeDate(1)}
                    disabled={!nextDateActive}
                >
                    <i className="bi bi-arrow-right"></i>
                </button>
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
                {
                    transactions.map(t => <TransactionCard key={'tr-' + t._id} data={t} onDelete={() => onDelete(t._id)} />)
                }
            </div>
        </div>
        <div className="row justify-content-center mb-3">
            <div className="col-12 col-md-6">
                <p>Вес на начало дня: {firstTodayWeight ? firstTodayWeight.value : <b>не измерялся</b>}</p>
                <p>Вес на конец дня: {lastTodayWeight ? lastTodayWeight.value : <b>не измерялся</b>}</p>
                <p>Последний вес: {`${lastWeight.value} (${new Date(lastWeight.date).toLocaleString()})`} </p>
                <p>
                    <span>Потребление за день:</span>
                    <span className="badge bg-info mx-1">{results.proteins}</span>
                    <span className="badge bg-warning mx-1">{results.fats}</span>
                    <span className="badge bg-success mx-1">{results.carbohydrates}</span>
                </p>
                <p>
                    <span>ККАЛ за день</span>
                    <span className="badge bg-danger mx-1">{results.calories}</span>
                </p>
                <p>
                    <span>Грамм за день</span>
                    <span className="badge bg-dark mx-1">{results.weight}</span>
                </p>
            </div>
        </div>
    </>)
}

export default Dashboard
