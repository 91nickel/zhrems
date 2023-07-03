function calculateCalories ({proteins, fats, carbohydrates}) {
    return Math.round((+proteins + +carbohydrates) * 4.1 + +fats * 9.3)
}

export default calculateCalories