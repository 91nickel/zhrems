export function groupDayTransactions (dayTransactions) {
    let transactionsGrouped = {}
    const dates = dayTransactions.reduce((agr, t) => {
        if (!agr.includes(t.date))
            return [...agr, t.date]
    }, [])
    dates.forEach(date => {
        transactionsGrouped[date] = dayTransactions.filter(t => t.date === date)
    })
    return transactionsGrouped
}
