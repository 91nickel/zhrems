const TOKEN_KEY = 'jwt-token'
const REFRESH_KEY = 'jwt-refresh-token'
const EXPIRES_KEY = 'jwt-expires'
const USER_ID_KEY = 'user-local-id'

export function setTokens ({refreshToken, idToken, localId, expiresIn = 3600}) {
    const expirationDate = (Date.now() + expiresIn * 1000).toString()
    console.log('setTokens', refreshToken, idToken, localId, expiresIn)
    if (localId)
        localStorage.setItem(USER_ID_KEY, localId)
    if (idToken)
        localStorage.setItem(TOKEN_KEY, idToken)
    if (refreshToken)
        localStorage.setItem(REFRESH_KEY, refreshToken)
    if (expirationDate)
        localStorage.setItem(EXPIRES_KEY, expirationDate)
}

export function getAccessToken () {
    return localStorage.getItem(TOKEN_KEY)
}

export function getRefreshToken () {
    return localStorage.getItem(REFRESH_KEY)
}

export function getTokenExpirationDate () {
    return +localStorage.getItem(EXPIRES_KEY)
}

export function getUserId () {
    return localStorage.getItem(USER_ID_KEY)
}

export function removeAuthData () {
    localStorage.removeItem(USER_ID_KEY)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_KEY)
    localStorage.removeItem(EXPIRES_KEY)
}

const localStorageService = {
    setTokens,
    getAccessToken,
    getRefreshToken,
    getTokenExpirationDate,
    getUserId,
    removeAuthData,
}

export default localStorageService