const tokenService = require('services/token.service')

async function authMiddleware (request, response, next) {
    if (request.method === 'OPTIONS') {
        return next()
    }
    try {
        // Bearer dsdsdsdsdsdsd...
        const token = request.headers.authorization.split(' ')[1]
        if (!token) {
            return response.status(401).json({error: {message: 'Unauthorized', code: 401}})
        }
        request.user = await tokenService.validateAccess(token)
        next()
    } catch (error) {
        return response.status(401).json({error: {message: 'Unauthorized', code: 401}})
    }
}

module.exports = authMiddleware
