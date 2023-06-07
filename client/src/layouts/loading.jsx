import React from 'react'

function LoadingLayout () {
    return (
        <div className="container d-flex justify-content-center align-items-center preloader" style={{height: '100vh'}}>
            <div className="spinner-border" role="status" style={{width: '5rem', height: '5rem'}}>
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}

export default LoadingLayout
