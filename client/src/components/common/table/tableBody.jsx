import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

const TableBody = ({data, columns, ...rest}) => {
    const renderContent = (item, column) => {
        if (column.component) {
            const component = column.component
            if (typeof component === 'function')
                return component(item)
            return component
        }
        return _.get(item, column.path)
    }

    return (
        <tbody>{
            data.map(item => {
                return (
                    <tr key={item._id}>
                        {Object.keys(columns).map(key => {
                            const column = columns[key]
                            return <td key={key}>{renderContent(item, column)}</td>
                        })}
                    </tr>
                )
            })
        }</tbody>
    )
}

TableBody.propTypes = {
    data: PropTypes.array.isRequired,
    columns: PropTypes.object.isRequired,
}

export default TableBody
