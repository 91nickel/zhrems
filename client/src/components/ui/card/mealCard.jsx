import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selector as authSelector } from 'store/user'
import { selector, action } from 'store/product'
import ControlsPanel from 'components/common/controlsPanel'
import PropTypes from 'prop-types'
import FeedsGroup from '../dashboard/feedsGroup'

const MealCard = ({data, onDelete}) => {
    const id = data._id
    const {userId, isAdmin} = useSelector(authSelector.authData())

    return (
        <div className="card mb-2">
            <div className="card-header d-flex justify-content-between">
                <h6>{data.name}</h6>
                {
                    (userId === data.user || isAdmin)
                    &&
                    <div className="controls">
                        <ControlsPanel id={id} prefix="/meals/" onDelete={onDelete}/>
                    </div>
                }
            </div>
            <FeedsGroup data={data.products}/>
        </div>
    )

}

MealCard.propTypes = {
    data: PropTypes.object,
    products: PropTypes.array,
    onDelete: PropTypes.func,
}

export default MealCard
