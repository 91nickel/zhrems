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
        console.log('http.service->request.interceptor', config)

        const expireDate = localStorageService.getTokenExpirationDate()
        const refreshToken = localStorageService.getRefreshToken()
        if (refreshToken && expireDate < Date.now()) {
            const data = await authService.refresh()
            localStorageService.setTokens({
                refreshToken: data.refresh_token,
                idToken: data.id_token,
                expiresIn: data.expires_in,
                localId: data.user_id,
            })
        }

        const accessToken = localStorageService.getAccessToken()
        if (accessToken) {
            config.headers = {...config.headers, 'Authorization': `Bearer: ${accessToken}`}
        }

        return config
    },
    function (error) {
        return Promise.reject(error)
    }
)

http.interceptors.response.use(
    function (response) {
        return response
    },
    function (error) {
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