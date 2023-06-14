import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import Pagination from 'components/common/pagination'
import GroupList from 'components/common/groupList'
import Table from 'components/ui/user/table'
import SearchStatus from 'components/ui/searchStatus'
import SearchString from 'components/ui/searchString'
import paginate from 'utils/paginate'

import { action, selector } from 'store/user'

const List = () => {

    const pageSize = 10
    const user = useSelector(selector.current())
    const users = useSelector(selector.all())
    const isLoaded = useSelector(selector.isDataLoaded())

    const [currentPage, setCurrentPage] = useState(1)
    const [currentSort, setCurrentSort] = useState({path: 'name', order: 'asc'})
    const [searchQuery, setSearchQuery] = useState('')

    const paginationHandler = {
        onChange: function (index) {
            setCurrentPage(index)
        }
    }

    const tableHandler = {
        onSort: function (item) {
            setCurrentSort(item)
        },
        onDelete: function (id) {
            console.log('handleDelete()', id)
        },
    }

    const searchHandler = {
        onSubmit: function (value) {
            setSearchQuery(value)
        },
    }

    function filter (data) {
        if (!data)
            return []
        let filteredData
        // if (currentProfession) {
        //     filteredUsers = data.filter(u => u.profession === currentProfession._id)
        // } else
        if (!!searchQuery) {
            const regexp = new RegExp(searchQuery, 'ig')
            const searchResults = data.filter(u => regexp.test(u.name))
            filteredData = searchResults.length > 0 ? searchResults : data
        } else {
            filteredData = data
        }
        // return filteredData.filter(u => u._id !== user._id)
        return filteredData
    }

    const filteredUsers = filter(users)

    const count = filteredUsers.length
    const sortedUsers = _.orderBy(filteredUsers, currentSort.path, currentSort.order)
    const crop = paginate(sortedUsers, currentPage, pageSize)

    return (
        <div className="row mt-3 justify-content-center">
            <div className="col-12 col-md-6 d-flex flex-column">
                <SearchStatus
                    value={count}
                />
                <SearchString
                    query={searchQuery}
                    onSubmit={searchHandler.onSubmit}
                />
                <Table
                    users={crop}
                    currentSort={currentSort}
                    onDelete={tableHandler.onDelete}
                    onSort={tableHandler.onSort}
                />
                <div className="d-flex justify-content-center">
                    <Pagination
                        currentPage={currentPage}
                        pageSize={pageSize}
                        itemsCount={count}
                        onChange={paginationHandler.onChange}
                    />
                </div>
            </div>
        </div>
    )
}

export default List
