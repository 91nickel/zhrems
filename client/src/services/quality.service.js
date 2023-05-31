import httpService from './http.service'

const endpoint = 'quality/'

const service = {
    // create: async (content) => {
    //     const {data} = await httpService.post(endpoint, content)
    //     return data
    // },
    // update: async (id, content) => {
    //     const {data} = await httpService.put(endpoint + id, content)
    //     return data
    // },
    // delete: async (id) => {
    //     const {data} = await httpService.delete(endpoint + id)
    //     return data
    // },
    // get: async (id) => {
    //     const {data} = await httpService.get(endpoint + id)
    //     return data
    // },
    // all: async () => {
    //     const {data} = await httpService.get(endpoint)
    //     return data
    // },
    get: async () => {
        const {data} = await httpService.get(endpoint)
        return data
    },
}

export default service