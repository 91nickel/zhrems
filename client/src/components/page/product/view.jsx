import React from 'react'
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selector as authSelector } from 'store/user'
import { selector, action } from 'store/product'
import ProductCard from 'components/ui/productCard'

const View = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const product = useSelector(selector.byId(id))

    const onRemove = () => {
        dispatch(action.delete(id))
    }
    console.log(product)

    return (
        <div className="row justify-content-center">
            <div className="col-12 col-md-6 mt-5 d-flex justify-content-between">
                <NavLink to=".." className="btn btn-primary">
                    <i className="bi bi-caret-left"/>
                    Назад
                </NavLink>
            </div>
            <div className="w-100"></div>
            <div className="col-12 col-md-6 mt-5">
                <ProductCard {...{product, onRemove}} />
            </div>
        </div>
    )
}

export default View
