// из группы со значениями на сотку получаем смесь со значениями на сотку
function calculateAverageEnergy (feeds) {
    const weight = feeds.reduce((agr, feed) => agr + feed.weight, 0)
    return {
        proteins: Math.round(100 * feeds.reduce((agr, feed) => agr + feed.weight * feed.proteins / 100, 0) / weight),
        fats: Math.round(100 * feeds.reduce((agr, feed) => agr + feed.weight * feed.fats / 100, 0) / weight),
        carbohydrates: Math.round(100 * feeds.reduce((agr, feed) => agr + feed.weight * feed.carbohydrates / 100, 0) / weight),
        calories: Math.round(100 * feeds.reduce((agr, feed) => agr + feed.weight * feed.calories / 100, 0) / weight),
        weight,
    }
}

export default calculateAverageEnergy
