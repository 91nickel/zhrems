import React from 'react'
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selector as authSelector } from 'store/user'
import { selector, action } from 'store/product'
import ProductCard from 'components/ui/card/productCard'
import NotFound from 'layouts/404'
import Button from '../../common/buttons'

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
        <>
            <div className="row mb-3">
                <div className="col-6 col-lg-3">
                    <Button.Back to=".." />
                </div>
            </div>
            <ProductCard {...{data: product, onDelete}} />
        </>
    )
}

export default View
