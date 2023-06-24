function getDateStart (date) {
    const newDate = new Date(date)
    newDate.setHours(0)
    newDate.setMinutes(0)
    newDate.setSeconds(0)
    return newDate
}

function getDateEnd (date) {
    const newDate = new Date(date)
    newDate.setHours(23)
    newDate.setMinutes(59)
    newDate.setSeconds(59)
    return newDate
}

module.exports = {getDateStart, getDateEnd}
