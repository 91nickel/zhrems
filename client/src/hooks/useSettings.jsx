import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { selector as userSelector, action as userAction } from 'store/user'
import localStorageService from '../services/localStorage.service'

const SettingsContext = React.createContext()

export const useSettings = () => {
    return useContext(SettingsContext)
}

const SettingsProvider = ({children}) => {
    const savedSettings = localStorageService.getUserSettings()

    const dispatch = useDispatch()
    const settings = useSelector(userSelector.settings())

    useEffect(() => {
        return dispatch(userAction.updateSettings(savedSettings))
    }, [])

    function updateSettings ({name, value}) {
        return dispatch(userAction.updateSettings({...settings, [name]: value}))
    }

    return (
        <SettingsContext.Provider value={{settings, updateSettings}}>{children}</SettingsContext.Provider>
    )
}

SettingsProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node)
    ])
}

export default SettingsProvider