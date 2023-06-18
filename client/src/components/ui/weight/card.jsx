import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selector as authSelector } from 'store/user'
import PropTypes from 'prop-types'
import ControlsPanel from 'components/common/controlsPanel'

const Card = ({weight, onDelete}) => {
    const {id} = useParams()
    const {userId, isAdmin} = useSelector(authSelector.authData())

    return (
        <div key={weight._id} className="card mb-2">
            <div className="card-header d-flex justify-content-between">
                <h6>{(new Date(weight.date)).toLocaleString()}</h6>
                {
                    (userId === weight.user || isAdmin)
                    &&
                    <div className="controls">
                        <ControlsPanel id={id} prefix="/weights/" onDelete={onDelete}/>
                    </div>
                }
            </div>
            <div className="card-body container-fluid">
                <div className="row">
                    <div className="col-6">
                        {weight._id && <p>ID: {weight._id}</p>}
                        {weight.desc && <p>DESC: {weight.desc}</p>}
                        {weight.value && <p>VALUE: {weight.value}</p>}
                    </div>
                    <div className="col-6">
                        <h5 className="energy d-flex justify-content-end ">
                            <span className="badge bg-info mx-1">{weight.proteins}</span>
                            <span className="badge bg-warning mx-1">{weight.fats}</span>
                            <span className="badge bg-success mx-1">{weight.carbohydrates}</span>
                        </h5>
                    </div>
                </div>
            </div>
        </div>
    )

}

Card.propTypes = {
    weight: PropTypes.object,
    onDelete: PropTypes.func,
}

export default Card
