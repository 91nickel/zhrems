import React from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selector as authSelector } from 'store/user'
import { selector as mealSelector, action as mealAction } from 'store/meal'
import MealCard from 'components/ui/card/mealCard'
import Button from 'components/common/buttons'
import NotFound from '../../../layouts/404'

const View = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {userId, isAdmin} = useSelector(authSelector.authData())

    const meal = useSelector(mealSelector.byId(id))

    function onDelete () {
        dispatch(mealAction.delete(id))
            .unwrap()
            .then(res => navigate('..'))
            .catch(e => console.error(e))
    }

    if (!meal)
        return <NotFound />

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
