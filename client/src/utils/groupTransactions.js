export function groupTransactions(transactions) {
    return {
        user: transactions.reduce((agrUser, t) => {
            if (agrUser === '') return t.user
            if (agrUser !== t.user) throw new Error('Transactions from different users can not be processed by form')
            return agrUser
        }, ''),
        date: transactions.reduce((agrDate, t) => {
            const trDate = new Date(t.date)
            if (agrDate === '') return new Date(t.date)
            // if (agrDate.getTime() !== trDate.getTime()) throw new Error('Transactions with different date can not be processed by form')
            return agrDate
        }, ''),
        transactions,
    }
}
