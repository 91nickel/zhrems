import React, { useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
// import * as yup from 'yup'
// import TextField from 'components/common/form/textField'
// import CheckboxField from 'components/common/form/checkboxField'
import Weight from './weight'
import FeedsGroup from 'components/ui/dashboard/feedsGroup'

import { action, selector } from 'store/feed'
import { action as weightAction } from 'store/weight'
import { selector as dateSelector } from 'store/date'
import { selector as userSelector } from 'store/user'
import { action as modalAction } from 'store/modal'

import { getDateStart } from 'utils/date'
import FEED_METHODS from 'components/modal/feed/methods'
import WEIGHT_METHODS from 'components/modal/weight/methods'

const Dashboard = () => {
    const params = useParams()
    const dispatch = useDispatch()

    const {userId} = useSelector(userSelector.authData())
    const currentDate = useSelector(dateSelector.get())
    const prevDate = useSelector(dateSelector.prev())
    const nextDate = useSelector(dateSelector.next())
    const dayFeeds = useSelector(selector.byDate(currentDate))
    const timeline = createTimeline()

    const dateString = currentDate.toLocaleString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    const results = {
        proteins: dayFeeds.reduce((agr, data) => Math.round(agr + data.weight * data.proteins / 100), 0),
        fats: dayFeeds.reduce((agr, data) => Math.round(agr + data.weight * data.fats / 100), 0),
        carbohydrates: dayFeeds.reduce((agr, data) => Math.round(agr + data.weight * data.carbohydrates / 100), 0),
        calories: dayFeeds.reduce((agr, data) => Math.round(agr + data.weight * data.calories / 100), 0),
        weight: dayFeeds.reduce((agr, data) => Math.round(agr + data.weight), 0),
    }

    function createTimeline () {
        return new Array(24)
            .fill({})
            .map((obj, i) => {
                const start = new Date()
                const end = new Date()
                start.setTime(getDateStart(currentDate).getTime() + 60 * 60 * 1000 * i)
                end.setTime(getDateStart(currentDate).getTime() + 60 * 60 * 1000 * (i + 1))
                return {start, end}
            })
    }

    function onAddFeed (method, date) {
        // console.log('onAddFeed', method)
        let modalParams
        if (method === FEED_METHODS.NEW) {
            modalParams = {title: 'Создать со своими параметрами', body: method}
        } else if (method === FEED_METHODS.SELECT) {
            modalParams = {title: 'Выбрать из списка', body: method}
        } else if (method === FEED_METHODS.MEAL) {
            modalParams = {title: 'Выбрать комбинацию', body: method}
        }
        dispatch(modalAction.open(modalParams, {method, date, user: userId}))
    }

    function onUpdateFeed (id) {
        console.log('onUpdateFeed', id)
        const modalParams = {title: 'Редактировать', body: FEED_METHODS.UPDATE}
        dispatch(modalAction.open(modalParams, {id}))
    }

    function onDeleteFeed (id) {
        // console.log('onDelete', id)
        dispatch(action.delete(id))
    }

    function onAddWeight (date) {
        console.log('onAddWeight', date)
        const modalParams = {title: 'Добавить вес', body: WEIGHT_METHODS.ADD}
        dispatch(modalAction.open(modalParams, {date: date.toISOString(), user: userId}))
    }

    function onUpdateWeight (id) {
        console.log('onAddWeight', id)
        const modalParams = {title: 'Редактировать вес', body: WEIGHT_METHODS.UPDATE}
        dispatch(modalAction.open(modalParams, {id}))
    }

    function onDeleteWeight (id) {
        // console.log('onDeleteWeight', id)
        dispatch(weightAction.delete(id))
    }

    return (
        <>
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
            {/*<div className="row justify-content-center mb-3">*/}
            {/*    <div className="col-6 col-md-3">*/}
            {/*        <NavLink className="btn btn-primary w-100" to="/weights/create">Взвеситься</NavLink>*/}
            {/*    </div>*/}
            {/*    <div className="col-6 col-md-3">*/}
            {/*        <NavLink className="btn btn-success w-100" to="/transactions/create">Поесть</NavLink>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className="row justify-content-center mb-3">
                <div className="col-12 col-md-6">
                    <Weight type="start" onAdd={onAddWeight} onUpdate={onUpdateWeight} onDelete={onDeleteWeight}/>
                    <ul className="list-group-flush p-0">
                        {
                            timeline.map(({start, end}) => {
                                const trGroup = dayFeeds.filter(t => {
                                    return new Date(t.date) >= start && new Date(t.date) < end
                                })
                                return (
                                    <li className="list-group-item px-0 py-1" key={start.toISOString()}>
                                        <div className="d-flex justify-content-between">
                                            <p className="fs-6 mb-0">
                                                {start.toLocaleTimeString('ru-RU', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                            <div>
                                                <button
                                                    className="btn btn-outline-success btn-sm mx-1"
                                                    onClick={() => onAddFeed(FEED_METHODS.NEW, start.toISOString())}
                                                >
                                                    <i className="bi bi-plus"/>
                                                </button>
                                                <button
                                                    className="btn btn-outline-success btn-sm mx-1"
                                                    onClick={() => onAddFeed(FEED_METHODS.SELECT, start.toISOString())}>
                                                    <i className="bi bi-check-square"/>
                                                </button>
                                                <button
                                                    className="btn btn-outline-success btn-sm mx-1"
                                                    onClick={() => onAddFeed(FEED_METHODS.MEAL, start.toISOString())}
                                                >
                                                    <i className="bi bi-list-ul"/>
                                                </button>
                                            </div>
                                        </div>
                                        {
                                            !!trGroup.length &&
                                            <FeedsGroup
                                                data={trGroup}
                                                onUpdate={onUpdateFeed}
                                                onDelete={onDeleteFeed}
                                            />
                                        }
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <Weight type="end" onAdd={onAddWeight} onUpdate={onUpdateWeight} onDelete={onDeleteWeight}/>
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
        </>
    )
}

Dashboard.propTypes = {
}

export default Dashboard
