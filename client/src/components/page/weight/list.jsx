import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import { selector as userSelector } from 'store/user'
import { selector, action } from 'store/weight'
import Pagination from 'components/common/pagination'
import Table from 'components/ui/table/weightTable'
import SearchStatus from 'components/ui/searchStatus'
import SearchString from 'components/ui/searchString'
import paginate from 'utils/paginate'
import Button from '../../common/buttons'

const List = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const pageSize = 10
    const [currentPage, setCurrentPage] = useState(1)
    const [currentSort, setCurrentSort] = useState({path: 'name', order: 'asc'})
    // const [searchQuery, setSearchQuery] = useState('')

    const users = useSelector(userSelector.get())
    const items = useSelector(selector.get())

    // useEffect(() => {
    //     setCurrentPage(1)
    // }, [searchQuery])

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
            dispatch(action.delete(id))
        },
    }

    const searchHandler = {
        onSubmit: function (value) {
            // setSearchQuery(value)
        },
    }

    function filter (data) {
        if (!data) return []
        return data.map(item => {
            return {
                ...item,
                date: (new Date(item.date)).toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                user: users.find(u => u._id === item.user)?.name,
            }
        })
    }

    const filteredItems = filter(items)

    const count = filteredItems.length
    const sortedItems = _.orderBy(filteredItems, currentSort.path, currentSort.order)
    const crop = paginate(sortedItems, currentPage, pageSize)

    return (
        <>
            <div className="row justify-content-center mt-3">
                <div className="col-12 col-md-6">
                    <div className="row justify-content-between">
                        <div className="col-6 col-lg-3">
                            <Button.Back to=".." />
                        </div>
                        <div className="col-6 col-lg-3">
                            <NavLink to="create" className="btn btn-sm btn-outline-success">
                                <i className="bi bi-plus"/>
                                Вес
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-3 justify-content-center">
                <div className="col-12 col-md-6 d-flex flex-column">
                    {/*<SearchStatus*/}
                    {/*    value={count}*/}
                    {/*/>*/}
                    {/*<SearchString*/}
                    {/*    query={searchQuery}*/}
                    {/*    onSubmit={searchHandler.onSubmit}*/}
                    {/*/>*/}
                    <Table
                        weights={crop}
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
        </>
    )
}

export default List
