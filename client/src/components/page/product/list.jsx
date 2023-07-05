import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import _ from 'lodash'

import { selector as authSelector } from 'store/user'
import { selector as productSelector, action as productAction } from 'store/product'
import { selector as sectionSelector } from 'store/section'

import Table from 'components/ui/table/productTable'
import Pagination from 'components/common/pagination'
import SectionFilter from 'components/common/sectionFilter'
import SearchStatus from 'components/ui/searchStatus'
import SearchString from 'components/ui/searchString'
import Button from 'components/common/buttons'
import CheckboxField from 'components/common/form/checkboxField'

import paginate from 'utils/paginate'

const defaultSection = {
    '_id': '',
    'name': 'Все',
}

const List = () => {

    const dispatch = useDispatch()

    const products = useSelector(productSelector.get())
    const sections = useSelector(sectionSelector.get())
    const {userId} = useSelector(authSelector.authData())

    const pageSize = 20
    const [currentPage, setCurrentPage] = useState(1)
    const [currentSort, setCurrentSort] = useState({path: 'name', order: 'asc'})
    const [currentSection, setCurrentSection] = useState(defaultSection)
    const [onlyMy, setOnlyMy] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')


    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery])

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
            dispatch(productAction.delete(id))
        },
    }

    const searchHandler = {
        onSubmit: function (value) {
            setSearchQuery(value)
        },
    }

    const filterHandler = {
        onSelect: function (value) {
            setCurrentSection(value)
            if (currentPage !== 1)
                setCurrentPage(1)
        },
    }

    function filter (data) {
        if (!data) return []

        let filteredData = [...data]

        if (currentSection._id) {
            filteredData = data.filter(p => p.section === currentSection._id)
        }

        if (onlyMy) {
            filteredData = data.filter(p => p.user === userId)
        }

        if (!!searchQuery) {
            const regexp = new RegExp(searchQuery, 'ig')
            filteredData = filteredData.filter(p => regexp.test(p.name))
        }

        return filteredData
    }

    const filteredProducts = filter(products)
    const count = filteredProducts.length
    const sortedProducts = _.orderBy(filteredProducts, currentSort.path, currentSort.order)
    const crop = paginate(sortedProducts, currentPage, pageSize)

    return (
        <>
            <div className="row">
                <div className="col-6 col-lg-3">
                    <Button.Back to=".."/>
                </div>
                <div className="col-6 col-lg-3">
                    <NavLink to="create" className="btn btn-sm btn-outline-success mb-1 w-100">
                        <i className="bi bi-plus "/>
                        Продукт
                    </NavLink>
                </div>
                <div className="col-6 col-lg-3">
                    <NavLink to="sections/create" className="btn btn-sm btn-outline-success mb-1 w-100">
                        <i className="bi bi-plus"/>
                        Раздел
                    </NavLink>
                </div>
                <div className="col-6 col-lg-3">
                    <NavLink to="sections" className="btn btn-sm btn-outline-success mb-1 w-100">
                        <i className="bi bi-list-ol"/>
                        Разделы
                    </NavLink>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    {/*<SearchStatus value={count}/>*/}
                    <SearchString
                        query={searchQuery}
                        onSubmit={searchHandler.onSubmit}
                    />
                    <SectionFilter
                        currentItem={currentSection}
                        items={[defaultSection, ...sections]}
                        namePath="name"
                        valuePath="_id"
                        onSelect={filterHandler.onSelect}
                    />
                    <CheckboxField onChange={({value}) => {setOnlyMy(value)}} value={onlyMy} name="my">
                        Показать только мои
                    </CheckboxField>
                    <Table
                        products={crop}
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
