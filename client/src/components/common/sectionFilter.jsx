import React from 'react'
import PropTypes from 'prop-types'

const SectionFilter = ({items, currentItem, valuePath, namePath, onSelect}) => {
    if (items && Object.keys(items).length) {
        return (
            <ul className="list-group list-group-horizontal mb-3">
                {
                    Object.values(items).map(el => {
                        return (
                            <li className={'list-group-item' + (el._id === currentItem._id ? ' active' : '')}
                                role="button"
                                key={el[valuePath]}
                                onClick={() => onSelect(el)}
                            >
                                {el[namePath]}
                            </li>
                        )
                    })
                }
            </ul>
        )
    }
}

SectionFilter.defaultProps = {
    valuePath: '_id',
    namePath: 'name',
}
SectionFilter.propTypes = {
    items: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    currentItem: PropTypes.object,
    valuePath: PropTypes.string.isRequired,
    namePath: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
}

export default SectionFilter
