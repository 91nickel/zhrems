export function getDateStart (date) {
    if (!date instanceof Date)
        throw new Error('Not Date instance')
    const newDate = new Date(date.getTime())
    newDate.setHours(0)
    newDate.setMinutes(0)
    newDate.setSeconds(0)
    newDate.setMilliseconds(0)
    return newDate
}

export function getDateEnd (date) {
    if (!date instanceof Date)
        throw new Error('Not Date instance')
    const newDate = new Date(date.getTime())
    newDate.setHours(23)
    newDate.setMinutes(59)
    newDate.setSeconds(59)
    newDate.setMilliseconds(999)
    return newDate
}
