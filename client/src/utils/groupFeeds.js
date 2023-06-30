export function groupFeeds(items) {
    return {
        user: items.reduce((agrUser, t) => {
            if (agrUser === '') return t.user
            if (agrUser !== t.user) throw new Error('Feeds from different users can not be processed by form')
            return agrUser
        }, ''),
        date: items.reduce((agrDate, t) => {
            const trDate = new Date(t.date)
            if (agrDate === '') return new Date(t.date)
            return agrDate
        }, ''),
        feeds: items,
    }
}
