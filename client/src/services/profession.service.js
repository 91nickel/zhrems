import httpService from './http.service'

const endpoint = 'profession/'

const service = {
    get: async () => {
        const {data} = await httpService.get(endpoint)
        return data
    },
}

export default service