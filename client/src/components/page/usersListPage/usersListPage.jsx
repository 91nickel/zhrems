import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import Pagination from 'components/common/pagination'
import GroupList from 'components/common/groupList'
import Table from 'components/ui/user/table'
import SearchStatus from 'components/ui/searchStatus'
import SearchString from 'components/ui/searchString'
import paginate from 'utils/paginate'

import { getCurrentUser, getUsers, getUsersIsLoading } from 'store/user'
import { getProfessions, getProfessionsIsLoading } from 'store/profession'

const UsersListPage = () => {

    const pageSize = 4
    const user = useSelector(getCurrentUser())

    const [currentProfession, setCurrentProfession] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const [currentSort, setCurrentSort] = useState({path: 'name', order: 'asc'})
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, currentProfession])

    const users = useSelector(getUsers())
    const usersIsLoading = useSelector(getUsersIsLoading())

    const professions = useSelector(getProfessions())
    const professionsIsLoading = useSelector(getProfessionsIsLoading())

    if (usersIsLoading || professionsIsLoading) {
        return (
            <div className="row mt-3">
                <div className="col-12"><h2>Users list page loading ...</h2></div>
            </div>
        )
    }

    const handleDelete = (id) => {
        console.log('handleDelete()', id)
    }

    const handleBookmark = (id) => {
        const newArray = users.map((el) => {
            if (id === el._id) {
                el.bookmark = !el.bookmark
                return el
            }
            return el
        })
        console.log(newArray)
    }

    const handlePageChange = (pageIndex) => {
        setCurrentPage(pageIndex)
    }

    const handleProfessionSelect = item => {
        setCurrentProfession(item)
        clearSearch()
    }

    const clearFilter = () => {
        setCurrentProfession(undefined)
    }

    const handleSort = (item) => {
        setCurrentSort(item)
    }

    const handleSearch = (value) => {
        setSearchQuery(value)
        clearFilter()
    }

    const clearSearch = () => {
        setSearchQuery('')
    }

    function filterUsers (data) {
        if (!data)
            return []
        let filteredUsers
        if (currentProfession) {
            filteredUsers = data.filter(u => u.profession === currentProfession._id)
        } else if (!!searchQuery) {
            const regexp = new RegExp(searchQuery, 'ig')
            const searchResults = data.filter(u => regexp.test(u.name))
            filteredUsers = searchResults.length > 0 ? searchResults : users
        } else {
            filteredUsers = users
        }
        return filteredUsers.filter(u => u._id !== user._id)
    }

    const filteredUsers = filterUsers(users)

    const count = filteredUsers.length
    const sortedUsers = _.orderBy(filteredUsers, currentSort.path, currentSort.order)
    const userCrop = paginate(sortedUsers, currentPage, pageSize)

    return (
        <div className="row mt-3">
            {professions && !professionsIsLoading &&
            <div className="col-2">
                <GroupList
                    items={professions}
                    currentItem={currentProfession}
                    valueProperty="_id"
                    contentProperty="name"
                    onItemSelect={handleProfessionSelect}
                />
                {count > 0 &&
                <button
                    className="btn btn-secondary mt-2"
                    type="button"
                    disabled={!currentProfession}
                    onClick={clearFilter}
                >Сбросить фильтр</button>}
            </div>
            }

            <div className="col-10 d-flex flex-column">
                <SearchStatus value={count}/>
                <SearchString query={searchQuery} onSubmit={handleSearch}/>
                {count > 0 &&
                <>
                    <Table
                        users={userCrop}
                        currentSort={currentSort}
                        onDelete={handleDelete}
                        onBookmark={handleBookmark}
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
                </>
                }
            </div>
        </div>
    )
}

export default UsersListPage
