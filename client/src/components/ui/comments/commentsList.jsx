import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
// import PropTypes from 'prop-types'
// import _ from 'lodash'
import Comment from './comment'
import CommentForm from './commentForm'
import { getComments, getCommentsIsLoading, loadCommentsList, createComment, removeComment } from 'store/comment'
import { nanoid } from 'nanoid'
import { getCurrentUser } from 'store/user'

const CommentsList = () => {
    const dispatch = useDispatch()
    const {id: pageId} = useParams()

    const user = useSelector(getCurrentUser())
    const comments = useSelector(getComments())
    const isLoading = useSelector(getCommentsIsLoading())

    useEffect(() => {
        dispatch(loadCommentsList(pageId))
    }, [pageId])

    const onSubmit = (comment) => {
        dispatch(
            createComment(
                {
                    _id: nanoid(),
                    pageId: pageId,
                    userId: user._id,
                    created_at: Date.now(),
                    ...comment,
                }
            )
        )
    }

    const onRemove = commentId => dispatch(removeComment(commentId))

    const hasComments = comments && Object.values(comments).length > 0

    return (
        <>
            <div className="card mb-2">
                <div className="card-body ">
                    <div>
                        <h2>New comment</h2>
                        <CommentForm pageId={pageId} onSubmit={onSubmit}/>
                    </div>
                </div>
            </div>
            {hasComments &&
            <div className="card mb-3">
                <div className="card-body ">
                    <h2>Comments</h2>
                    <hr/>
                    {
                        !isLoading
                            ? Object.values(comments).map(comment =>
                                <Comment key={comment._id} comment={comment} onRemove={onRemove}/>)
                            : <p>Loading...</p>
                    }
                </div>
            </div>
            }
        </>
    )
}

CommentsList.propTypes = {
    // id: PropTypes.string.isRequired,
}

export default CommentsList
