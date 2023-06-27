import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selector as authSelector } from 'store/user'
import { selector as dateSelector } from 'store/date'
import { selector as weightSelector } from 'store/weight'
import { selector as transactionSelector } from 'store/transaction'
import PropTypes from 'prop-types'
import ControlsPanel from 'components/common/controlsPanel'

const FirstDayWeight = () => {
    const {userId, isAdmin} = useSelector(authSelector.authData())
    const currentDate = useSelector(dateSelector.get())
    const todayWeights = useSelector(weightSelector.byDate(currentDate))
    const todayTransactions = useSelector(transactionSelector.byDate(currentDate))
    const firstTodayWeight = todayWeights.length ? todayWeights[0] : null
    const firstTodayTransaction = todayTransactions.length ? todayTransactions[0] : null

    let weight

    if (firstTodayWeight && (!firstTodayTransaction || new Date(firstTodayWeight.date)) <= new Date(firstTodayTransaction.date)) {
        weight = firstTodayWeight
    }

    return (
        <div className="card mb-2">
            <div className="card-body container-fluid">
                {
                    weight
                        ?
                        <h3 className="d-flex justify-content-between">
                            <span>{weight.value}</span>
                            <span>{(new Date(weight.date)).toLocaleTimeString('ru-RU', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</span>
                        </h3>
                        :
                        <h3>Не измерялся</h3>
                }
            </div>
        </div>
    )

}

FirstDayWeight.propTypes = {
    // weight: PropTypes.object,
    // onDelete: PropTypes.func,
}

export default FirstDayWeight
