import React from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { selector as authSelector } from 'store/user'
import { selector, action } from 'store/section'

import SectionForm from 'components/ui/form/sectionForm'
import Button from '../../common/buttons'

const Update = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {userId, isAdmin} = useSelector(authSelector.authData())
    const section = useSelector(selector.byId(id))

    async function onSubmit (payload) {
        // console.log('onSubmit()', payload)
        await dispatch(action.update(payload)).unwrap()
        navigate('..', {replace: true})
    }

    return (
        <>
            <div className="row mb-3">
                <div className="col-6 col-lg-3">
                    <Button.Back to=".." />
                </div>
            </div>
            <h2>Редактировать раздел</h2>
            <SectionForm type="update" startData={section} onSubmit={onSubmit}/>
        </>
    )
}

export default Update
