import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import { Navigate } from 'react-router-dom'
// import * as yup from 'yup'
//
// import TextField from 'components/common/form/textField'
// import CheckboxField from 'components/common/form/checkboxField'
// import { getAuthErrors, getUsersIsAuthorized, signIn } from 'store/user'

const Dashboard = () => {
    // const dispatch = useDispatch()
    // const [data, setData] = useState({email: '', password: '', stayOn: false})
    // const [errors, setErrors] = useState({})
    // const isLoggedIn = useSelector(getUsersIsAuthorized())
    const [currentDate] = useState(new Date())
    const [date, setDate] = useState(new Date())
    const prevDateActive = true
    const nextDateActive =
        currentDate.getFullYear() !== date.getFullYear()
        || currentDate.getMonth() !== date.getMonth()
        || currentDate.getDate() !== date.getDate()

    const submitChangeDate = (days) => {
        setDate(prevDate => {
            prevDate.setDate(prevDate.getDate() + days)
            return new Date(prevDate.getTime())
        })
    }

    const dateString = date.toLocaleString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    // if (isLoggedIn) {
    //     return <Navigate to="/" replace={true}/>
    // }

    return (<>
        <div className="row justify-content-center my-3">
            <div className="col-1 d-flex justify-content-start">
                <button
                    className="btn btn-success w-50"
                    onClick={() => submitChangeDate(-1)}
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
                    onClick={() => submitChangeDate(1)}
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
    </>)
}

export default Dashboard
