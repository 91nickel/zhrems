import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selector as authSelector } from 'store/user'
import { selector, action } from 'store/feed'
import PropTypes from 'prop-types'
import Feed from './feed'
import EnergyResults from 'components/common/energyResult'
import { groupFeeds } from 'utils/groupFeeds'
import calculateTotalEnergy from 'utils/calculateTotalEnergy'
import calculateAverageEnergy from 'utils/calculateAverageEnergy'

const FeedsGroup = ({data, onUpdate, onDelete}) => {

    const {user, date, feeds} = groupFeeds(data)
    const {userId, isAdmin} = useSelector(authSelector.authData())

    const results = calculateTotalEnergy(calculateAverageEnergy(feeds))

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
                            <EnergyResults {...results} />
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
