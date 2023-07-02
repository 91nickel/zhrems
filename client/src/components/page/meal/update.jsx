import React from 'react'
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom'

import MealForm from 'components/ui/meal/form'

import { useDispatch, useSelector } from 'react-redux'
import { selector as authSelector } from 'store/user'
import { selector as mealSelector, action as mealAction} from 'store/meal'
import { selector as productSelector} from 'store/product'

const Update = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {userId, isAdmin} = useSelector(authSelector.authData())
    const meal = useSelector(mealSelector.byId(id))

    const onSubmit = payload => {
        console.log('Meal.update.onSubmit()', payload)
        dispatch(mealAction.update({_id: id, ...payload}))
            .unwrap()
            .then(() => navigate('..'))
            .catch(error => console.error(error.message))
    }

    return (
        <>
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 mt-5">
                    <NavLink to=".." className="btn btn-primary">
                        <i className="bi bi-caret-left"/>
                        Назад
                    </NavLink>
                </div>
                <div className="w-100"></div>
                <div className="col-12 col-md-6 mt-5">
                    <h2>Редактирование комбинации</h2>
                    <MealForm type="update" startData={meal} onSubmit={onSubmit}/>
                </div>
            </div>
        </>
    )
}

export default Update
