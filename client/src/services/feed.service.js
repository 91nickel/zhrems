import httpService from './http.service'

const entrypoint = 'feed/'

const service = {
    get: async () => {
        const {data} = await httpService.get(entrypoint)
        return data
    },
    getById: async (id) => {
        const {data} = await httpService.get(entrypoint + id)
        return data
    },
    getByDate: async (date) => {
        if (date instanceof Date) {
            const {data} = await httpService.get(entrypoint, {params: {date: date.toISOString()}})
            return data
        } else {
            throw new Error('Date must be an instance of Date::class')
        }
    },
    create: async (payload) => {
        const {data} = await httpService.put(entrypoint, payload)
        return data
    },
    update: async (payload) => {
        const {data} = await httpService.patch(entrypoint, payload)
        return data
    },
    delete: async (id) => {
        const {data} = await httpService.delete(entrypoint + id)
        return data
    },
}

export default service