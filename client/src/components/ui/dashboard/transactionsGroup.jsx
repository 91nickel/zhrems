import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selector as authSelector } from 'store/user'
import { selector, action } from 'store/transaction'
import PropTypes from 'prop-types'
import ControlsPanel from 'components/common/controlsPanel'
import { groupTransactions } from 'utils/groupTransactions'
import Transaction from './transaction'

const TransactionsGroup = ({data, onUpdate, onDelete}) => {

    const {user, date, transactions} = groupTransactions(data)
    const {userId, isAdmin} = useSelector(authSelector.authData())

    const results = {
        proteins: transactions.reduce((agr, data) => Math.round(agr + data.weight * data.proteins / 100), 0),
        fats: transactions.reduce((agr, data) => Math.round(agr + data.weight * data.fats / 100), 0),
        carbohydrates: transactions.reduce((agr, data) => Math.round(agr + data.weight * data.carbohydrates / 100), 0),
        calories: transactions.reduce((agr, data) => Math.round(agr + data.weight * data.calories / 100), 0),
        weight: transactions.reduce((agr, data) => Math.round(agr + data.weight), 0),
    }

    return (
        <div key={data._id} className="card mt-1">
            <div className="card-body py-0 px-3">
                <ul className="list-group-flush p-0">
                    {
                        transactions.map((t, i) =>
                            <Transaction data={t} onUpdate={onUpdate} onDelete={onDelete} key={'p' + i}/>)
                    }
                    {
                        !!transactions.length &&
                        <li className="list-group-item px-0 d-flex justify-content-end fs-4">
                            <span className="badge bg-info mx-1">{results.proteins}</span>
                            <span className="badge bg-warning mx-1">{results.fats}</span>
                            <span className="badge bg-success mx-1">{results.carbohydrates}</span>
                            <span className="badge bg-danger mx-1">{results.calories}</span>
                            <span className="badge bg-dark mx-1">{results.weight}</span>
                        </li>
                    }
                </ul>
            </div>
        </div>
    )
}

TransactionsGroup.propTypes = {
    data: PropTypes.array,
    onDelete: PropTypes.func,
    onUpdate: PropTypes.func,
}

export default TransactionsGroup
