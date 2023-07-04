import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import { selector as authSelector } from 'store/user'

import EnergyResults from 'components/common/energyResult'
import ControlsPanel from 'components/common/controlsPanel'
import calculateCalories from 'utils/calculateCalories'

const ProductCard = ({data, onDelete}) => {
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
                        <ControlsPanel id={id} prefix="/products/" onDelete={onDelete}/>
                    </div>
                }
            </div>
            <div className="card-body container-fluid">
                <div className="row">
                    <div className="col-6">
                        {data._id && <p>ID: {data._id}</p>}
                        {data.desc && <p>Описание: {data.desc}</p>}
                        {data.weight && <p>Вес по умолчанию: {data.weight}</p>}
                    </div>
                    <div className="col-6">
                        <h5 className="energy d-flex justify-content-end ">
                            <EnergyResults
                                proteins={data.proteins}
                                fats={data.fats}
                                carbohydrates={data.carbohydrates}
                                calories={calculateCalories(data)}
                                weight={data.weight ? data.weight : 0}
                                showZero={true}
                            />
                        </h5>
                    </div>
                </div>
            </div>
        </div>
    )

}

ProductCard.propTypes = {
    data: PropTypes.object,
    onDelete: PropTypes.func,
}

export default ProductCard
