import axios from 'axios'
import conf from 'config.json'
import { toast } from 'react-toastify'
import authService from 'services/auth.service'
import localStorageService from 'services/localStorage.service'

const http = axios.create({
    baseURL: conf.apiEntrypoint,
})

http.interceptors.request.use(
    async function (config) {
        const hasAccessToken = !!localStorageService.getAccessToken()
        const authExpired = hasAccessToken && localStorageService.getTokenExpirationDate() < Date.now()
        const refreshToken = localStorageService.getRefreshToken()

        // console.log('http.service->request.interceptor.onFulfilled', {config, hasAccessToken, authExpired, refreshToken})

        if (refreshToken && authExpired) {
            try {
                const data = await authService.refresh()
                localStorageService.setTokens({
                    refreshToken: data.refresh_token,
                    idToken: data.id_token,
                    expiresIn: data.expires_in,
                    localId: data.user_id,
                })
            } catch (error) {
                console.error('Auth refresh failed', error)
                localStorageService.removeAuthData()
            }
        }

        const accessToken = localStorageService.getAccessToken()
        if (accessToken) {
            config.headers = {...config.headers, 'Authorization': `Bearer: ${accessToken}`}
        }

        return config
    },
    function (error) {
        console.log('http.service->request.interceptor.onRejected', )
        return Promise.reject(error)
    }
)

http.interceptors.response.use(
    function (response) {
        console.log('http.service.response.interceptor.onFulfilled')
        return response
    },
    function (error) {
        console.log('http.service.response.interceptor.onRejected')
        const expectedErrors = error.response && error.response.status >= 400 && error.response.status < 500
        if (!expectedErrors) {
            console.error(error)
            console.error(error?.response?.data?.error)
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