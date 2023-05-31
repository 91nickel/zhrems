import React from 'react'
import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import { getProfessions, getProfessionsIsLoading } from 'store/profession'

function Profession ({id}) {

    const professions = useSelector(getProfessions())
    const isLoading = useSelector(getProfessionsIsLoading())

    if (isLoading) return 'Loading...'

    const profession = professions.find(p => p._id === id)

    return <p>{profession.name}</p>
}

Profession.propTypes = {
    id: PropTypes.string.isRequired,
}

export default Profession
