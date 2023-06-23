import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selector as authSelector } from 'store/user'
import { selector, action } from 'store/transaction'
import PropTypes from 'prop-types'
import ControlsPanel from 'components/common/controlsPanel'

const Card = ({data, onDelete}) => {
    const id = data._id
    const date = new Date(data.date)
    const {userId, isAdmin} = useSelector(authSelector.authData())

    const results = {
        proteins: data.products.reduce((agr, data) => Math.round(agr + data.weight * data.proteins / 100), 0),
        fats: data.products.reduce((agr, data) => Math.round(agr + data.weight * data.fats / 100), 0),
        carbohydrates: data.products.reduce((agr, data) => Math.round(agr + data.weight * data.carbohydrates / 100), 0),
        calories: data.products.reduce((agr, data) => Math.round(agr + data.weight * data.calories / 100), 0),
        weight: data.products.reduce((agr, data) => Math.round(agr + data.weight), 0),
    }

    return (
        <div key={data._id} className="card mb-2">
            <div className="card-header d-flex justify-content-between">
                <div className="dates d-flex">
                    <h6 className="me-3">{date.toLocaleDateString('ru-RU', {
                        year: '2-digit', month: '2-digit', day: '2-digit'
                    })}</h6>
                    <h6 className="me-3">{date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})}</h6>
                </div>
                {
                    (userId === data.user || isAdmin)
                    &&
                    <div className="controls">
                        <ControlsPanel id={id} prefix="/transactions/" onDelete={onDelete}/>
                    </div>
                }
            </div>
            <div className="card-body d-flex flex-wrap flex-column">
                <div className="d-flex justify-content-end">
                    <b>вес/ккал</b>
                </div>
                {
                    data.products.map((p, i) => {
                        return (
                            <div key={'p' + i} className="d-flex">
                                <span>{p.name}</span>
                                <span className="flex-grow-1"></span>
                                <span>{p.weight}/{p.calories}</span>
                            </div>
                        )
                    })
                }
            </div>
            <div className="card-footer d-flex justify-content-end fs-4">
                <span className="badge bg-info mx-1">{results.proteins}</span>
                <span className="badge bg-warning mx-1">{results.fats}</span>
                <span className="badge bg-success mx-1">{results.carbohydrates}</span>
                <span className="badge bg-danger mx-1">{results.calories}</span>
                <span className="badge bg-dark mx-1">{results.weight}</span>
            </div>
        </div>
    )
}

Card.propTypes = {
    data: PropTypes.object,
    onDelete: PropTypes.func,
}

export default Card
