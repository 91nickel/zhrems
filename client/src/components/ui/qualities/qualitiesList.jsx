import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import PropTypes from 'prop-types'
import Quality from './quality'
import { getQualities, getQualitiesIsLoading, loadQualitiesList } from 'store/quality'

const QualitiesList = ({ids}) => {
    const dispatch = useDispatch();
    const qualities = useSelector(getQualities())
    const isLoading = useSelector(getQualitiesIsLoading())
    useEffect(() => {
        dispatch(loadQualitiesList())
    }, [])

    if (isLoading) return 'Loading...'

    return <>{
        qualities
            .filter(quality => ids.includes(quality._id))
            .map((quality, i) => (
                <Quality key={`quality_${i}`} {...quality} />
            ))
    }</>
}

QualitiesList.propTypes = {
    ids: PropTypes.array.isRequired
}

export default QualitiesList
