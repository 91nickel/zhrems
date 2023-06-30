import React from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { selector as authSelector } from 'store/user'
import { selector, action } from 'store/weight'
import WeightForm from 'components/ui/weight/weightForm'

const Update = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // const {userId, isAdmin} = useSelector(authSelector.authData())
    // const weight = useSelector(selector.byId(id))

    const onSubmit = payload => {
        dispatch(action.update({_id: id, ...payload}))
            .unwrap()
            .then(() => navigate('../..'))
            .catch(error => console.error(error.message))
    }

    return (
        <div className="row justify-content-center">
            <div className="col-12 col-md-6 mt-5">
                <NavLink to="../.." className="btn btn-primary">
                    <i className="bi bi-caret-left"/>
                    Назад
                </NavLink>
            </div>
            <div className="w-100"></div>
            <div className="col-12 col-md-6 mt-5">
                <h2>Редактировать взвешивание</h2>
                <WeightForm onSubmit={onSubmit}/>
            </div>
        </div>
    )
}

export default Update
