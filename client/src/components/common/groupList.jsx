import React from 'react'
import PropTypes from 'prop-types'

const GroupList = ({items, currentItem, valueProperty, contentProperty, onItemSelect}) => {
    if (items && Object.keys(items).length) {
        return (
            <ul className="list-group">
                {
                    Object.keys(items).map(key => {
                        const el = items[key]
                        return (
                            <li className={'list-group-item' + (el === currentItem ? ' active' : '')}
                                role="button"
                                key={el[valueProperty]}
                                onClick={() => onItemSelect(el)}
                            >{el[contentProperty]}</li>
                        )
                    })
                }
            </ul>
        )
    }
}

GroupList.defaultProps = {
    valueProperty: '_id',
    contentProperty: 'name',
}
GroupList.propTypes = {
    items: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    currentItem: PropTypes.object,
    valueProperty: PropTypes.string.isRequired,
    contentProperty: PropTypes.string.isRequired,
    onItemSelect: PropTypes.func.isRequired,
}

export default GroupList
