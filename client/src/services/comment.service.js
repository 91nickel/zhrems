import httpService from './http.service'

const endpoint = 'comment/'

const service = {
    create: async (content) => {
        const {data} = await httpService.put(`${endpoint}${content._id}`, content)
        return data
    },
    // update: async (id, content) => {
    //     const {data} = await httpService.put(endpoint + id, content)
    //     return data
    // },
    // all: async () => {
    //     const {data} = await httpService.get(endpoint)
    //     return data
    // },
    get: async (pageId) => {
        const {data} = await httpService.get(endpoint, {
            params: {
                orderBy: '"pageId"',
                equalTo: `"${pageId}"`
            }
        })
        return data
    },
    delete: async (id) => {
        const {data} = await httpService.delete(endpoint + id)
        return data
    },
}

export default service