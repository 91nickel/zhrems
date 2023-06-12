import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selector as authSelector } from 'store/user'
import { selector, action } from 'store/product'
import ProductCard from '../../ui/productCard'

const List = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {userId, isAdmin} = useSelector(authSelector.authData())

    const products = useSelector(selector.getAll())
    const isDataLoaded = useSelector(selector.isDataLoaded())

    const onRemove = id => dispatch(action.delete(id))

    return (
        <>
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 mt-5 d-flex justify-content-between">
                    <NavLink to=".." className="btn btn-primary">
                        <i className="bi bi-caret-left"/>
                        Назад
                    </NavLink>
                    <NavLink to="create" className="btn btn-success">
                        <i className="bi bi-plus"/>
                        Добавить
                    </NavLink>
                </div>
                <div className="w-100"></div>
                <div className="col-12 col-md-6 mt-5">
                    {!isDataLoaded && 'Loading..'}
                    {
                        isDataLoaded
                        && products.length
                        && products.map(product => {
                            return <ProductCard key={product._id} {...{product, onRemove}}/>
                        })
                    }
                    {isDataLoaded && !products.length && 'Product list is empty'}
                </div>
            </div>
        </>
    )
}

export default List
