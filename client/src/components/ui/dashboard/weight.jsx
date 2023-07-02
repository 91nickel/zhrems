import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selector as authSelector } from 'store/user'
import { selector as dateSelector } from 'store/date'
import { selector as weightSelector } from 'store/weight'
import { selector as feedSelector } from 'store/feed'
import PropTypes from 'prop-types'
import ControlsPanel from 'components/common/controlsPanel'
import { NavLink } from 'react-router-dom'

const Weight = ({type, onAdd, onUpdate, onDelete}) => {
    const {userId, isAdmin} = useSelector(authSelector.authData())
    const startDate = useSelector(dateSelector.todayStart())
    const endDate = useSelector(dateSelector.todayEnd())
    const startWeight = useSelector(weightSelector.todayStart())
    const endWeight = useSelector(weightSelector.todayEnd())

    const displayWeight = type === 'start' ? startWeight : endWeight
    const displayDate = type === 'start' ? startDate : endDate

    function format (value) {
        const integer = value.toString().split('.')[0]
        const fraction = value.toString().split('.')[1] || '0'
        return `${integer}.${(fraction + '00').slice(0,3)}`.slice(-6)
    }

    return (
        <div className="card mb-2">
            <div className="card-body container-fluid">
                {
                    displayWeight
                        ?
                        <h3 className="d-flex justify-content-between">
                            <span>{format(displayWeight.value)} кг</span>
                            <span>
                                <button
                                    className="btn btn-sm btn-warning mx-1"
                                    onClick={() => onUpdate(displayWeight._id)}>
                                    <i className="bi bi-pencil-square" style={{width: '1rem', height: '1rem'}}></i>
                                </button>
                                <button
                                    className="btn btn-sm btn-danger mx-1"
                                    onClick={() => onDelete(displayWeight._id)}>
                                    <i className="bi bi-x-square" style={{width: '1rem', height: '1rem'}}></i>
                                </button>
                            </span>
                        </h3>
                        :
                        <h3 className="d-flex justify-content-between">
                            <span>Не измерялся</span>
                            <span>
                                {
                                    !!onAdd
                                        ?
                                        <button className="btn btn-success" onClick={() => onAdd(displayDate)}>
                                            <i className="bi bi-plus" style={{width: '1rem', height: '1rem'}}></i>
                                        </button>
                                        :
                                        <NavLink
                                            to={'/weights/create/' + displayDate.toISOString()}
                                            className="btn btn-success">
                                            <i className="bi bi-plus" style={{width: '1rem', height: '1rem'}}></i>
                                        </NavLink>
                                }
                            </span>
                        </h3>
                }
            </div>
        </div>
    )

}

Weight.defaultProps = {
    type: 'start',
}

Weight.propTypes = {
    type: PropTypes.string,
    onAdd: PropTypes.func,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
}

export default Weight
