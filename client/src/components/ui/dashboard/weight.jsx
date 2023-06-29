import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selector as authSelector } from 'store/user'
import { selector as dateSelector } from 'store/date'
import { selector as weightSelector } from 'store/weight'
import { selector as transactionSelector } from 'store/transaction'
import PropTypes from 'prop-types'
import ControlsPanel from 'components/common/controlsPanel'
import { NavLink } from 'react-router-dom'

const Weight = ({type, onDelete}) => {
    const {userId, isAdmin} = useSelector(authSelector.authData())
    const startDate = useSelector(dateSelector.todayStart())
    const endDate = useSelector(dateSelector.todayEnd())
    const startWeight = useSelector(weightSelector.todayStart())
    const endWeight = useSelector(weightSelector.todayEnd())

    const displayWeight = type === 'start' ? startWeight : endWeight
    const displayDate = type === 'start' ? startDate : endDate

    return (
        <div className="card mb-2">
            <div className="card-body container-fluid">
                {
                    displayWeight
                        ?
                        <h3 className="d-flex justify-content-between">
                            <span>{displayWeight.value} кг</span>
                            <ControlsPanel id={displayWeight._id} prefix="/weights/" onDelete={onDelete}/>
                        </h3>
                        :
                        <h3 className="d-flex justify-content-between">
                            <span>Не измерялся</span>
                            <span>
                                <NavLink to={'/weights/create/' + displayDate.toISOString()} className="btn btn-success">
                                    <i className="bi bi-plus" style={{width: '1rem', height: '1rem'}}></i>
                                </NavLink>
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
    onDelete: PropTypes.func,
}

export default Weight
