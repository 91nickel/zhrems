import axios from 'axios'
import { toast } from 'react-toastify'
import configFile from 'config.json'
import authService from 'services/auth.service'
import localStorageService from 'services/localStorage.service'

const http = axios.create({
    baseURL: configFile.apiEndpoint
})

http.defaults.baseURL = configFile.apiEndpoint

http.interceptors.request.use(
    async function (config) {
        if (configFile.isFirebase) {
            const isContainsSlash = /\/$/.test(config.url)
            config.url = (isContainsSlash ? config.url.slice(0, -1) : config.url) + '.json'
            // console.log(config.url)
            const expireDate = localStorageService.getTokenExpirationDate()
            const refreshToken = localStorageService.getRefreshToken()
            if (refreshToken && expireDate < Date.now()) {
                const data = await authService.refresh()
                // console.log(data)
                localStorageService.setTokens({
                    refreshToken: data.refresh_token,
                    idToken: data.id_token,
                    expiresIn: data.expires_in,
                    localId: data.user_id,
                })
            }
            const accessToken = localStorageService.getAccessToken()
            if (accessToken) {
                config.params = {...config.params, auth: accessToken}
            }
        }
        return config
    },
    function (error) {
        return Promise.reject(error)
    }
)

function transformData (data) {
    return data && !data._id
        ? Object.keys(data).map(key => ({...data[key]}))
        : data
}

http.interceptors.response.use(
    function (response) {
        if (configFile.isFirebase) {
            // console.log('beforeTransform', response.data)
            response.data = {content: transformData(response.data)}
            // console.log('afterTransform', response.data)
        }
        return response
    },
    function (error) {
        // console.log('Interceptor', error)
        const expectedErrors = error.response && error.response.status >= 400 && error.response.status < 500
        if (!expectedErrors) {
            // console.log(error)
            toast.info('Something went wrong. Try later...')
            toast.error('Something went wrong. Try later...')
        }
        return Promise.reject(error)
    })

const httpService = {
    get: http.get,
    post: http.post,
    put: http.put,
    patch: http.patch,
    delete: http.delete,
}

export default httpService