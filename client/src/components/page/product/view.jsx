import React from 'react'
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selector as authSelector } from 'store/user'
import { selector, action } from 'store/product'
import ProductCard from 'components/ui/card/productCard'
import NotFound from 'layouts/404'

const View = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const product = useSelector(selector.byId(id))

    const onDelete = () => {
        dispatch(action.delete(id))
            .unwrap()
            .then(() => navigate('..'))
            .catch(error => console.error(error.message))
    }

    if (!product)
        return <NotFound />

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
                <ProductCard {...{data: product, onDelete}} />
            </div>
        </div>
    )
}

export default View
