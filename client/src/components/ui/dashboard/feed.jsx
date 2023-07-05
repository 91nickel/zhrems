import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import EnergyResults from 'components/common/energyResult'
import calculateTotalEnergy from 'utils/calculateTotalEnergy'
import Button from '../../common/buttons'

const Feed = ({data, onUpdate: handleUpdate, onDelete: handleDelete}) => {

    const {_id: id, name} = data

    const results = calculateTotalEnergy(data)

    const hasExternalHandlers = !!handleUpdate || !!handleDelete

    function onUpdate (e) {
        e.preventDefault()
        handleUpdate(id)
    }

    function onDelete (e) {
        e.preventDefault()
        handleDelete(id)
    }

    return (
        <li className="list-group-item d-flex justify-content-between ps-3 pe-0">
            <div className="col">{name}</div>
            <div className="col d-flex justify-content-end">
                <div>
                    <EnergyResults {...results} />
                </div>
            </div>
            {
                hasExternalHandlers
                && <div className="col-2 d-flex justify-content-end">
                    <div>
                        {!!handleUpdate && <Button.Update onClick={onUpdate}/>}
                        {!!handleDelete && <Button.Delete onClick={onDelete}/>}
                    </div>
                </div>
            }

        </li>
    )
}

Feed.propTypes = {
    data: PropTypes.object,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
}

export default Feed
