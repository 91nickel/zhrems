import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import service from 'services/profession.service'
import { toast } from 'react-toastify'

const ProfessionContext = React.createContext()

export const useProfession = () => {
    return useContext(ProfessionContext)
}

const ProfessionProvider = ({children}) => {
    const [professions, setProfessions] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        getProfessionsList()
    }, [])

    useEffect(() => {
        if (error !== null) {
            toast.error(error)
            setError(null)
        }
    }, [error])

    async function getProfessionsList () {
        try {
            const {content} = await service.get()
            setProfessions(content)
            setIsLoading(false)
        } catch (error) {
            errorCatcher(error)
        }
    }

    function getProfession (id) {
        return professions.find(profession => profession._id === id)
    }

    function errorCatcher (error) {
        const {message} = error.response.data
        setError(message)
    }

    return (
        <ProfessionContext.Provider value={{professions, isLoading, getProfession}}>
            {children}
        </ProfessionContext.Provider>
    )
}

ProfessionProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node)
    ])
}

export default ProfessionProvider