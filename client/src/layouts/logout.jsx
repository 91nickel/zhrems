import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { action } from 'store/user'

const Logout = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(action.logOut())
            .unwrap()
            .then(navigate('/', {replace: true}))
    }, [])
    return ''
}

export default Logout
