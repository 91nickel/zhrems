import httpService from './http.service'
const entrypoint = 'product/'

const service = {
    get: async () => {
        const {data} = await httpService.get(entrypoint)
        return data
    },
    getById: async (id) => {
        const {data} = await httpService.get(entrypoint + id)
        return data
    },
    create: async (payload) => {
        const {data} = await httpService.put(entrypoint, payload)
        return data
    },
    update: async (payload) => {
        const {data} = await httpService.patch(entrypoint + payload._id, payload)
        return data
    },
    delete: async (id) => {
        const {data} = await httpService.delete(entrypoint + id)
        return data
    },
}

export default service