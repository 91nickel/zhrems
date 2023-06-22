import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selector as authSelector } from 'store/user'
import { selector, action } from 'store/product'
import PropTypes from 'prop-types'
import ControlsPanel from '../../common/controlsPanel'

const Card = ({product, onDelete}) => {
    const id = product._id
    const {userId, isAdmin} = useSelector(authSelector.authData())

    return (
        <div key={product._id} className="card mb-2">
            <div className="card-header d-flex justify-content-between">
                <h6>{product.name}</h6>
                {
                    (userId === product.user || isAdmin)
                    &&
                    <div className="controls">
                        <ControlsPanel id={id} prefix="/products/" onDelete={onDelete}/>
                    </div>
                }
            </div>
            <div className="card-body container-fluid">
                <div className="row">
                    <div className="col-6">
                        {product._id && <p>ID: {product._id}</p>}
                        {product.desc && <p>{product.desc}</p>}
                    </div>
                    <div className="col-6">
                        <h5 className="energy d-flex justify-content-end ">
                            <span className="badge bg-info mx-1">{product.proteins}</span>
                            <span className="badge bg-warning mx-1">{product.fats}</span>
                            <span className="badge bg-success mx-1">{product.carbohydrates}</span>
                            {product.weight && <span className="badge bg-dark mx-1">{product.weight}</span>}
                        </h5>
                    </div>
                </div>
            </div>
        </div>
    )

}

Card.propTypes = {
    product: PropTypes.object,
    onDelete: PropTypes.func,
}

export default Card
