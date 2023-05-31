import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import PropTypes from 'prop-types'
import service from 'services/comment.service'
import { toast } from 'react-toastify'
import { nanoid } from 'nanoid'
import { useSelector } from 'react-redux'
import { getCurrentUser } from '../store/user'

const CommentsContext = React.createContext()

export const useComment = () => {
    return useContext(CommentsContext)
}

const CommentProvider = ({children}) => {
    const {id: pageId} = useParams()
    const user = useSelector(getCurrentUser())
    const [comments, setComments] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        getCommentsList()
    }, [pageId])

    useEffect(() => {
        if (error !== null) {
            toast.error(error)
            setError(null)
        }
    }, [error])

    async function getCommentsList () {
        try {
            const {content} = await service.get(pageId)
            setComments(content)
        } catch (error) {
            errorCatcher(error)
        } finally {
            setIsLoading(false)
        }
    }

    function getComment (pageId) {
        // return comments.find(profession => profession._id === id)
    }

    async function createComment (data) {
        const comment = {
            ...data,
            _id: nanoid(),
            pageId: pageId,
            userId: user._id,
            created_at: Date.now(),
        }
        try {
            const {content} = await service.create(comment)
            setComments(prevState => ([...prevState, content]))
        } catch (error) {
            errorCatcher(error)
        }
    }

    async function removeComment (id) {
        try {
            const {content} = await service.delete(id)
            setComments(prevState => prevState.filter(c => c._id !== id))
            return content
        } catch (error) {
            errorCatcher(error)
        }
    }

    function errorCatcher (error) {
        const {message} = error.response.data
        setError(message)
    }

    return (
        <CommentsContext.Provider value={{comments, isLoading, createComment, removeComment, getComment}}>
            {children}
        </CommentsContext.Provider>
    )
}

CommentProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node)
    ])
}

export default CommentProvider