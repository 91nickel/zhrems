import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import Pagination from 'components/common/pagination'
import GroupList from 'components/common/groupList'
import UsersTable from 'components/ui/usersTable'
import SearchStatus from 'components/ui/searchStatus'
import SearchString from 'components/ui/searchString'
import paginate from 'utils/paginate'

import { action, selector } from 'store/user'

const List = () => {

    const pageSize = 10
    const user = useSelector(selector.current())
    const users = useSelector(selector.all())
    const usersIsLoading = useSelector(selector.isDataLoaded())

    const [currentPage, setCurrentPage] = useState(1)
    const [currentSort, setCurrentSort] = useState({path: 'name', order: 'asc'})


    const handleDelete = id => {
        console.log('handleDelete()', id)
    }

    // const handleBookmark = id => {
    //     const newArray = users.map((el) => {
    //         if (id === el._id) {
    //             el.bookmark = !el.bookmark
    //             return el
    //         }
    //         return el
    //     })
    //     console.log(newArray)
    // }

    const handlePageChange = pageIndex => {
        setCurrentPage(pageIndex)
    }

    // const handleProfessionSelect = item => {
    //     setCurrentProfession(item)
    //     clearSearch()
    // }

    // const clearFilter = () => {
    //     setCurrentProfession(undefined)
    // }

    const handleSort = item => {
        setCurrentSort(item)
    }

    // const handleSearch = value => {
    //     setSearchQuery(value)
    //     clearFilter()
    // }

    // const clearSearch = () => {
    //     setSearchQuery('')
    // }

    function filterUsers (users) {
        // if (!data)
        //     return []
        // let filteredUsers
        // if (currentProfession) {
        //     filteredUsers = data.filter(u => u.profession === currentProfession._id)
        // } else if (!!searchQuery) {
        //     const regexp = new RegExp(searchQuery, 'ig')
        //     const searchResults = data.filter(u => regexp.test(u.name))
        //     filteredUsers = searchResults.length > 0 ? searchResults : users
        // } else {
        //     filteredUsers = users
        // }
        // return filteredUsers.filter(u => u._id !== user._id)
        return users
    }

    const filteredUsers = filterUsers(users)

    const count = filteredUsers.length
    const sortedUsers = _.orderBy(filteredUsers, currentSort.path, currentSort.order)
    const userCrop = paginate(sortedUsers, currentPage, pageSize)

    return (
        <div className="row mt-3 justify-content-center">
            <div className="col-12 col-md-6 d-flex flex-column">
                <UsersTable
                    users={userCrop}
                    currentSort={currentSort}
                    onDelete={handleDelete}
                    onSort={handleSort}
                />
                <div className="d-flex justify-content-center">
                    <Pagination
                        currentPage={currentPage}
                        pageSize={pageSize}
                        itemsCount={count}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    )
}

export default List
