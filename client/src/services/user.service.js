import httpService from './http.service'
import localStorageService from './localStorage.service'
const entrypoint = 'user/'

const service = {
    get: async () => {
        const {data} = await httpService.get(entrypoint)
        return data
    },
    getCurrentUser: async () => {
        // console.log('user.service.getCurrentUser()', localStorageService.getUserId())
        const {data} = await httpService.get(entrypoint + localStorageService.getUserId())
        return data
    },
    create: async (payload) => {
        const {data} = await httpService.put(entrypoint + payload._id, payload)
        return data
    },
    update: async (payload) => {
        const {data} = await httpService.patch(entrypoint + payload._id, payload)
        return data
    },
}

export default service