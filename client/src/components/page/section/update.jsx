import React from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { selector as authSelector } from 'store/user'
import { selector as sectionSelector, action as sectionAction } from 'store/section'

import SectionForm from 'components/ui/form/sectionForm'
import Button from '../../common/buttons'
import NotFound from '../../../layouts/404'
import Forbidden from '../../../layouts/403'

const Update = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {userId, isAdmin} = useSelector(authSelector.authData())
    const section = useSelector(sectionSelector.byId(id))

    async function onSubmit (payload) {
        // console.log('onSubmit()', payload)
        await dispatch(sectionAction.update(payload)).unwrap()
        navigate('..', {replace: true})
    }

    if (!section)
        return <NotFound />

    if (section.user !== userId && !isAdmin)
        return <Forbidden/>

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
