import httpService from './http.service'
import localStorageService from './localStorage.service'
const endpoint = 'user/'

const service = {
    get: async () => {
        const {data} = await httpService.get(endpoint)
        return data
    },
    getCurrentUser: async () => {
        const {data} = await httpService.get(endpoint + localStorageService.getUserId())
        return data
    },
    create: async (payload) => {
        const {data} = await httpService.put(endpoint + payload._id, payload)
        return data
    },
    update: async (payload) => {
        const {data} = await httpService.patch(endpoint + payload._id, payload)
        return data
    },
}

export default service