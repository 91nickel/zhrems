import React from 'react'
import PropTypes from 'prop-types'

const MainWrapper = ({children}) => {
    return (
        <div className="row justify-content-center mt-3">
            <div className="col-12 col-lg-6">
                {children}
            </div>
        </div>
    )
}

MainWrapper.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node)
    ])
}


export default MainWrapper
