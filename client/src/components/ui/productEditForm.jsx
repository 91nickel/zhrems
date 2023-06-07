import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import _ from 'lodash'
import * as yup from 'yup'

import TextField from 'components/common/form/textField'
// import RadioField from 'components/common/form/radioField'
// import SelectField from 'components/common/form/selectField'
// import MultiSelectField from 'components/common/form/multiSelectField'

import { useDispatch, useSelector } from 'react-redux'

// import { getQualities, getQualitiesIsLoading } from 'store/quality'
// import { getProfessions, getProfessionsIsLoading } from 'store/profession'
// import { getCurrentUser, getUsersIsLoading, updateUser } from 'store/user'

const ProductEditForm = () => {
    const {id} = useParams()
    const dispatch = useDispatch()

    const [data, setData] = useState({})
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    // const user = useSelector(getCurrentUser())
    // const userIsLoading = useSelector(getUsersIsLoading())

    // const professions = useSelector(getProfessions())
    // const professionsIsLoading = useSelector(getProfessionsIsLoading())

    // const qualities = useSelector(getQualities())
    // const qualitiesIsLoading = useSelector(getQualitiesIsLoading())


    useEffect(() => {
        // const isLoading = userIsLoading || professionsIsLoading || qualitiesIsLoading
        // setIsLoading(isLoading)
        // if (!isLoading) {
        //     setData(createUserFields())
        // }
    }, [])

    useEffect(() => {
        validate()
    }, [data])

    function createUserFields (data = {}) {
        return {
            // ...user,
            // ...data,
            // profession: (data.profession && Object.values(professions).find(p => data.profession && p._id === data.profession)) || (user.profession || ''),
            // qualities: (data.qualities && Object.values(qualities).filter(q => data.qualities.includes(q._id))) || (user.qualities || []),
        }
    }

    const handleChange = (target) => {
        setData(prevState => (
            {
                ...prevState,
                [target.name]: target.value,
            }
        ))
    }

    const handleSubmit = (event) => {
        // event.preventDefault()
        // if (!validate() || !hasDifference()) return false
        // dispatch(updateUser(data))
        // history.push(`/users/${id}`)
    }


    const validate = () => {

        const validateScheme = yup.object().shape({
            email: yup.string()
                .required('Электронная почта обязательна для заполнения')
                .email('Электронная почта указана в неверном формате'),
            name: yup.string()
                .required('Имя должно быть указано'),
        })

        validateScheme.validate(data)
            .then(() => setErrors({}))
            .catch(err => setErrors({[err.path]: err.message}))

        return Object.keys(errors).length === 0
    }

    const hasDifference = () => {
        // return !_.isEqual(user, data)
    }

    const isValid = Object.keys(errors).length === 0

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Имя"
                type="text"
                name="name"
                value={data.name}
                error={errors.name}
                onChange={handleChange}/>
            <TextField
                label="Электронная почта"
                type="text"
                name="email"
                value={data.email}
                error={errors.email}
                onChange={handleChange}/>
            <button
                className="btn btn-primary w-100 mx-auto"
                type="submit"
                disabled={!isValid || !hasDifference()}
            >
                Сохранить
            </button>
        </form>
    )
}

export default ProductEditForm
