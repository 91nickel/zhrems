import React from 'react'
import PropTypes from 'prop-types'

const EnergyResults = ({proteins, fats, carbohydrates, calories, weight, showZero, badgeClass}) => {
    return (
        <>
            {
                (proteins || showZero)
                &&
                <span className={'badge bg-info ' + badgeClass}>{Math.round(proteins)}</span>
            }
            {
                (fats || showZero)
                &&
                <span className={'badge bg-warning ' + badgeClass}>{Math.round(fats)}</span>
            }
            {
                (carbohydrates || showZero)
                &&
                <span className={'badge bg-success ' + badgeClass}>{Math.round(carbohydrates)}</span>
            }
            {
                (calories || showZero)
                &&
                <span className={'badge bg-danger ' + badgeClass}>{Math.round(calories)}</span>
            }
            {
                (weight || showZero)
                &&
                <span className={'badge bg-dark ' + badgeClass}>{Math.round(weight)}</span>
            }
        </>
    )
}

EnergyResults.defaultProps = {
    proteins: 0,
    fats: 0,
    carbohydrates: 0,
    calories: 0,
    weight: 0,
    showZero: true,
    badgeClass: 'mx-1',
}

EnergyResults.propTypes = {
    proteins: PropTypes.number,
    fats: PropTypes.number,
    carbohydrates: PropTypes.number,
    calories: PropTypes.number,
    weight: PropTypes.number,
    showZero: PropTypes.bool,
    badgeClass: PropTypes.string,
}

export default EnergyResults
