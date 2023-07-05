import React from 'react'
import PropTypes from 'prop-types'
import Feed from './feed'
import EnergyResults from 'components/common/energyResult'
import calculateTotalEnergy from 'utils/calculateTotalEnergy'
import calculateAverageEnergy from 'utils/calculateAverageEnergy'

const FeedsGroup = ({data: feeds, onUpdate, onDelete}) => {

    const results = calculateTotalEnergy(calculateAverageEnergy(feeds))

    return (
        <div className="card mt-1">
            <div className="card-body p-0">
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
