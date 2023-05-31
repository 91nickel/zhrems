import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
// import api from 'api'
// import SelectField from '../../common/form/selectField'
import * as yup from 'yup'
import TextArea from '../../common/form/textArea'

const CommentForm = ({onSubmit}) => {
    // const [users, setUsers] = useState([])
    const [data, setData] = useState({})
    const [errors, setErrors] = useState({})

    // useEffect(() => {
    //     api.users.fetchAll().then(data => {
    //         setUsers(data)
    //     })
    // }, [])
    useEffect(() => {
        validate()
    }, [data])

    const handleChange = (target) => {
        setData(prevState => ({...prevState, [target.name]: target.value}))
    }

    const validate = () => {
        const validateScheme = yup.object().shape({
            content: yup.string().required('Заполните текст комментария'),
            // userId: yup.string().required('Выберите пользователя'),
        })
        validateScheme.validate(data)
            .then(() => setErrors({}))
            .catch(err => setErrors({[err.path]: err.message}))
        return Object.keys(errors).length === 0
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (!validate()) return false
        onSubmit(data)
        setData({})
    }

    const isValid = Object.keys(errors).length === 0

    return (
        <form className="justify-content-end" onSubmit={handleSubmit}>
            <TextArea
                label="Сообщение"
                name="content"
                value={data.content || ''}
                rows={3}
                error={errors.content}
                onChange={handleChange}
            />
            <div className="d-flex justify-content-end">
                <button className="btn btn-primary" type="submit" disabled={!isValid}>Опубликовать</button>
            </div>
        </form>
    )
}

CommentForm.propTypes = {
    onSubmit: PropTypes.func,
}

export default CommentForm
