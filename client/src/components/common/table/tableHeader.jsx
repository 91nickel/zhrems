import React from 'react'
import PropTypes from 'prop-types'

const TableHeader = ({columns, currentSort, onSort, ...rest}) => {
    const handleSort = item => {
        if (currentSort.path === item) {
            onSort({
                ...currentSort,
                order: currentSort.order === 'asc' ? 'desc' : 'asc',
            })
        } else {
            onSort({path: item, order: 'asc'})
        }
    }

    return (
        <thead>
            <tr>
                {
                    Object.keys(columns).map(key => {
                        const column = columns[key]

                        const showCaret = currentSort.path === column.path
                        const caretClasslist = currentSort.order === 'asc' ? 'bi bi-caret-down-fill' : 'bi bi-caret-up-fill'

                        return (
                            <th key={key}
                                onClick={column.path ? () => handleSort(column.path) : undefined}
                                {...{role: column.path && 'button'}}
                                scope="col">
                                <span>{column.name}</span>
                                {showCaret && <i className={caretClasslist}/>}
                            </th>
                        )
                    })
                }
            </tr>
        </thead>
    )
}

TableHeader.propTypes = {
    columns: PropTypes.object.isRequired,
    currentSort: PropTypes.object.isRequired,
    onSort: PropTypes.func.isRequired,
}

export default TableHeader
