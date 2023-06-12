import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selector as authSelector } from 'store/user'
import { selector, action } from 'store/product'
import PropTypes from 'prop-types'

const ProductCard = ({product, onRemove}) => {
    const {id} = useParams()
    const {userId, isAdmin} = useSelector(authSelector.authData())

    return (
        <div key={product._id} className="card mb-2">
            <div className="card-header d-flex justify-content-between">
                <h6>{product.name}</h6>
                {
                    (userId === product.user || isAdmin)
                    && <div className="controls">
                        {!!id ||
                        <NavLink to={product._id} className="btn btn-sm btn-success mx-1">
                            <i
                                className="bi bi-eye"
                                style={{width: '1rem', height: '1rem'}}></i>
                        </NavLink>}
                        <NavLink to={(!!id ? '' : `${product._id}/`) + 'update'} className="btn btn-sm btn-warning mx-1">
                            <i
                                className="bi bi-pencil-square"
                                style={{width: '1rem', height: '1rem'}}></i>
                        </NavLink>
                        <button
                            className="btn btn-sm btn-danger mx-1"
                            onClick={() => onRemove(product._id)}>
                            <i
                                className="bi bi-x-square"
                                style={{width: '1rem', height: '1rem'}}></i>
                        </button>
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
                        </h5>
                    </div>
                </div>
            </div>
        </div>
    )

}

ProductCard.propTypes = {
    product: PropTypes.object,
    onRemove: PropTypes.func,
}

export default ProductCard
