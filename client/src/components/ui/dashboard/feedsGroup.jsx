import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selector as authSelector } from 'store/user'
import { selector, action } from 'store/feed'
import PropTypes from 'prop-types'
import ControlsPanel from 'components/common/controlsPanel'
import { groupFeeds } from 'utils/groupFeeds'
import Feed from './feed'

const FeedsGroup = ({data, onUpdate, onDelete}) => {

    const {user, date, feeds} = groupFeeds(data)
    const {userId, isAdmin} = useSelector(authSelector.authData())

    const results = {
        proteins: feeds.reduce((agr, data) => Math.round(agr + data.weight * data.proteins / 100), 0),
        fats: feeds.reduce((agr, data) => Math.round(agr + data.weight * data.fats / 100), 0),
        carbohydrates: feeds.reduce((agr, data) => Math.round(agr + data.weight * data.carbohydrates / 100), 0),
        calories: feeds.reduce((agr, data) => Math.round(agr + data.weight * data.calories / 100), 0),
        weight: feeds.reduce((agr, data) => Math.round(agr + data.weight), 0),
    }

    return (
        <div key={data._id} className="card mt-1">
            <div className="card-body py-0 px-3">
                <ul className="list-group-flush p-0">
                    {
                        feeds.map((t, i) =>
                            <Feed data={t} onUpdate={onUpdate} onDelete={onDelete} key={'p' + i}/>)
                    }
                    {
                        !!feeds.length &&
                        <li className="list-group-item px-0 d-flex justify-content-end fs-4">
                            <span className="badge bg-info mx-1">{results.proteins}</span>
                            <span className="badge bg-warning mx-1">{results.fats}</span>
                            <span className="badge bg-success mx-1">{results.carbohydrates}</span>
                            <span className="badge bg-danger mx-1">{results.calories}</span>
                            <span className="badge bg-dark mx-1">{results.weight}</span>
                        </li>
                    }
                </ul>
            </div>
        </div>
    )
}

FeedsGroup.propTypes = {
    data: PropTypes.array,
    onDelete: PropTypes.func,
    onUpdate: PropTypes.func,
}

export default FeedsGroup
