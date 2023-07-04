// из значений на сотку получаем абсолютные
function calculateTotalEnergy ({weight, calories, proteins, fats, carbohydrates}) {
    return {
        proteins: Math.round(proteins / 100 * weight),
        fats: Math.round(fats / 100 * weight),
        carbohydrates: Math.round(carbohydrates / 100 * weight),
        calories: Math.round(calories / 100 * weight),
        weight: Math.round(weight),
    }
}

export default calculateTotalEnergy