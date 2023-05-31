import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import service from 'services/quality.service'
import { toast } from 'react-toastify'

const QualityContext = React.createContext()

export const useQuality = () => {
    return useContext(QualityContext)
}

const QualityProvider = ({children}) => {
    const [qualities, setQualities] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        getQualitiesList()
    }, [])

    useEffect(() => {
        if (error !== null) {
            toast.error(error)
            setError(null)
        }
    }, [error])

    async function getQualitiesList () {
        try {
            const {content} = await service.get()
            setQualities(content)
            setIsLoading(false)
        } catch (error) {
            errorCatcher(error)
        }
    }

    function getQuality (id) {
        return qualities.find(quality => quality._id === id)
    }

    function getQualities (ids) {
        return qualities.filter(quality => ids.includes(quality._id))
    }

    function errorCatcher (error) {
        const {message} = error.response.data
        setError(message)
    }

    return (
        <QualityContext.Provider value={{qualities, isLoading, getQuality, getQualities}}>
            {children}
        </QualityContext.Provider>
    )
}

QualityProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node)
    ])
}

export default QualityProvider