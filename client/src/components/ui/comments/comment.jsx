import React from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { getCurrentUser, getUser } from 'store/user'
import renderPhrase from 'utils/renderPhrase'

const Comment = ({comment, onRemove}) => {

    const user = useSelector(getCurrentUser())
    const profile = useSelector(getUser(comment.userId))

    const generateDate = (ts) => {
        const months = ['', 'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря']
        const now = new Date
        const createdAt = new Date(+ts)
        const diffminutes = Math.ceil((now - createdAt) / 1000 / 60)
        const someYear = now.getFullYear() === createdAt.getFullYear()
        const someMonth = someYear && now.getMonth() === createdAt.getMonth()
        const someDay = someMonth && now.getDay() === createdAt.getDay()
        const word = renderPhrase(diffminutes, ['минуту', 'минуты', 'минут'])
        if (diffminutes < 31) {
            return `${diffminutes} ${word} назад`
        } else if (someDay) {
            return `${createdAt.getHours()}:${createdAt.getMinutes()}`
        } else if (someYear) {
            return `${createdAt.getDay()} ${months[createdAt.getMonth()]}`
        } else {
            return `${createdAt.getDay()} ${months[createdAt.getMonth()]} ${createdAt.getFullYear()}`
        }
    }

    // console.log(generateDate(Date.now() - 60000))
    // console.log(generateDate(Date.now() - 60000 * 5))
    // console.log(generateDate(Date.now() - 60000 * 10))
    // console.log(generateDate(Date.now() - 60000 * 30))
    // console.log(generateDate(Date.now() - 60000 * 60))
    // console.log(generateDate(Date.now() - 60000 * 60 * 24))
    // console.log(generateDate(Date.now() - 60000 * 60 * 24 * 365))

    return (
        <div className="bg-light card-body mb-3">
            <div className="row">
                <div className="col">
                    <div className="d-flex flex-start ">
                        <img
                            src={profile.image}
                            className="rounded-circle shadow-1-strong me-3"
                            alt="avatar"
                            width="65"
                            height="65"
                        />
                        <div className="flex-grow-1 flex-shrink-1">
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="mb-1 ">
                                        {profile.name}&nbsp;
                                        <span className="small">
                                            {generateDate(+comment.created_at)}
		                              </span>
                                    </p>
                                    {comment.userId === user._id &&
                                    <button
                                        className="btn btn-sm text-primary d-flex align-items-center"
                                        onClick={() => onRemove(comment._id)}
                                    >
                                        <i className="bi bi-x-lg"/>
                                    </button>
                                    }
                                </div>
                                <p className="small mb-0">{comment.content}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

Comment.propTypes = {
    comment: PropTypes.object,
    onRemove: PropTypes.func,
}

export default Comment
