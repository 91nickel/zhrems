import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import service from 'services/user.service'
import { toast } from 'react-toastify'

const UserContext = React.createContext()

export const useUser = () => {
    return useContext(UserContext)
}

const UserProvider = ({children}) => {
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        getUsers()
    }, [users])

    useEffect(() => {
        if (error !== null) {
            toast.error(error)
            setError(null)
        }
    }, [error])

    async function getUsers () {
        try {
            const {content} = await service.get()
            setUsers(content)
            setIsLoading(false)
        } catch (error) {
            errorCatcher(error)
        }
    }

    function getUser (id) {
        return users.find(user => user._id === id)
    }

    function errorCatcher (error) {
        const {message} = error.response.data
        setError(message)
    }

    return (
        <UserContext.Provider
            value={{
                users,
                getUser
            }}
        >
            {!isLoading ? children : 'Loading...'}
        </UserContext.Provider>
    )
}

UserProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node)
    ])
}

export default UserProvider