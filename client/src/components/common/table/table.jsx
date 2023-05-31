import React from 'react'
import PropTypes from 'prop-types'
import TableHeader from './tableHeader'
import TableBody from './tableBody'

const Table = ({columns, data, currentSort, onSort, children, ...rest}) => {
    return (
        <table className="table">
            {children || (
                <>
                    <TableHeader {...{columns, currentSort, onSort}} />
                    <TableBody {...{columns, data}} />
                </>
            )}
        </table>
    )
}

Table.propTypes = {
    columns: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    currentSort: PropTypes.object.isRequired,
    onSort: PropTypes.func,
    children: PropTypes.array,
}

export default Table
