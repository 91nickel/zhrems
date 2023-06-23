import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selector as authSelector } from 'store/user'
import { selector, action } from 'store/product'
import ControlsPanel from 'components/common/controlsPanel'
import PropTypes from 'prop-types'

const Card = ({data, onDelete}) => {
    const id = data._id

    const {userId, isAdmin} = useSelector(authSelector.authData())

    return (
        <div className="card mb-2">
            <div className="card-header d-flex justify-content-between">
                <h6>{data.name}</h6>
                {
                    (userId === data.user || isAdmin)
                    &&
                    <div className="controls">
                        <ControlsPanel id={id} prefix="/products/" onDelete={onDelete}/>
                    </div>
                }
            </div>
            <div className="card-body container-fluid">
                <div className="row">
                    <div className="col-6">
                        {data._id && <p>ID: {data._id}</p>}
                        {data.desc && <p>{data.desc}</p>}
                    </div>
                    <div className="col-6">
                        <h5 className="energy d-flex justify-content-end ">
                            <span className="badge bg-info mx-1">{data.proteins}</span>
                            <span className="badge bg-warning mx-1">{data.fats}</span>
                            <span className="badge bg-success mx-1">{data.carbohydrates}</span>
                            {data.weight && <span className="badge bg-dark mx-1">{data.weight}</span>}
                        </h5>
                    </div>
                </div>
            </div>
        </div>
    )

}

Card.propTypes = {
    data: PropTypes.object,
    onDelete: PropTypes.func,
}

export default Card
