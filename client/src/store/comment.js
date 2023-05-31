import { createSlice } from '@reduxjs/toolkit'
import service from 'services/comment.service'
import { nanoid } from 'nanoid'

const slice = createSlice({
    name: 'comment',
    initialState: {
        entities: null,
        isLoading: true,
        error: null,
    },
    reducers: {
        commentsRequested: (state) => {
            state.isLoading = true
        },
        commentsReceived: (state, action) => {
            state.entities = action.payload
            state.isLoading = false
        },
        commentsRequestFailed: (state, action) => {
            state.error = action.payload
            state.isLoading = false
        },
        commentCreated: (state, action) => {
            state.entities.push(action.payload)
            state.isLoading = false
        },
        commentDeleted: (state, action) => {
            state.entities = state.entities.filter(c => c._id !== action.payload)
            state.isLoading = false
        },
    }
})

const {reducer, actions} = slice
const {
    commentsRequested,
    commentsReceived,
    commentsRequestFailed,
    commentCreated,
    commentDeleted,
} = actions

export const loadCommentsList = pageId => async dispatch => {
    dispatch(commentsRequested())
    try {
        const {content} = await service.get(pageId)
        dispatch(commentsReceived(content))
    } catch (error) {
        dispatch(commentsRequestFailed(error.message))
    }
}

export const createComment = comment => async dispatch => {
    console.log(comment)
    dispatch(commentsRequested())
    try {
        const {content} = await service.create(comment)
        dispatch(commentCreated(content))
        // setComments(prevState => ([...prevState, content]))
    } catch (error) {
        dispatch(commentsRequestFailed(error.message))
    }
}

export const removeComment =  id => async dispatch => {
    dispatch(commentsRequested())
    try {
        await service.delete(id)
        dispatch(commentDeleted(id))
    } catch (error) {
        dispatch(commentsRequestFailed(error.message))
    }
}


export const getComments = () => state => state.comment.entities
export const getCommentsIsLoading = () => state => state.comment.isLoading

export default reducer
