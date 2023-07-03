import React from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selector as authSelector } from 'store/user'
import { selector as mealSelector, action as mealAction } from 'store/meal'
import { selector as productSelector, action as productAction } from 'store/product'
import Card from 'components/ui/meal/card'

const View = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {userId, isAdmin} = useSelector(authSelector.authData())

    const meal = useSelector(mealSelector.byId(id))
    // const allProducts = useSelector(productSelector.get())

    // const products = allProducts
    //     .filter(fullProduct => meal.products.map(mp => mp._id).includes(fullProduct._id))
    //     .map(fullProduct => ({...fullProduct, ...meal.products.find(mp => mp._id === fullProduct._id)}))

    function onDelete () {
        dispatch(action.delete(id))
            .unwrap()
            .then(res => navigate('..'))
            .catch(e => console.error(e))
    }

    return (
        <>
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 mt-5 d-flex justify-content-between">
                    <NavLink to=".." className="btn btn-primary">
                        <i className="bi bi-caret-left"/>
                        Назад
                    </NavLink>
                    <NavLink to="../create" className="btn btn-success">
                        <i className="bi bi-plus"/>
                        Добавить
                    </NavLink>
                </div>
                <div className="w-100"></div>
                <div className="col-12 col-md-6 mt-5">
                    <Card {...{data: meal, onDelete}} />
                </div>
            </div>
        </>
    )
}

export default View
