import React from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selector as authSelector } from 'store/user'
import { selector as mealSelector, action as mealAction } from 'store/meal'
import { selector as productSelector, action as productAction } from 'store/product'
import MealCard from 'components/ui/card/mealCard'
import Button from '../../common/buttons'

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
        return onsole.log('onDelete')
        dispatch(action.delete(id))
            .unwrap()
            .then(res => navigate('..'))
            .catch(e => console.error(e))
    }

    return (
        <>
            <div className="w-25 mb-3">
                <Button.Back to=".."/>
            </div>
            <div className="w-100"></div>
            <MealCard {...{data: meal, onDelete}} />
        </>
    )
}

export default View
