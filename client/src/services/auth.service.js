import axios from 'axios'
import conf from 'config.json'
import localStorageService from './localStorage.service'

export const httpAuth = axios.create({
    baseURL: `${conf.apiEntrypoint}auth/`,
})

httpAuth.interceptors.response.use(
    function (response) {
        // console.log('httpAuth.interceptor.response.fullfilled', response)
        return response
    },
    function (error) {
        // console.log('httpAuth.interceptor.response.rejected', error)
        return Promise.reject(error.response.data.error)
    })

const service = {

    signUp: async ({email, password, ...rest}) => {
        const {data} = await httpAuth.post('signUp', {email, password, ...rest})
        return data
    },

    signIn: async ({email, password}) => {
        const {data} = await httpAuth.post('signInWithPassword', {email, password})
        return data
    },

    signOut: async () => {
        const {data} = await httpAuth.post('signOut', {}, {
            headers: {
                'Authorization': 'Bearer ' + localStorageService.getAccessToken()
            }
        })
        return data
    },

    refresh: async () => {
        const {data} = await httpAuth.post('token', {
            refresh_token: localStorageService.getRefreshToken(),
        })
        console.log('auth.service.refresh()', data)
        return data
    },

}

export default service
