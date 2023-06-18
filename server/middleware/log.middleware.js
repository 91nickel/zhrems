async function logMiddleware (request, response, next) {
    if (request.method === 'OPTIONS')
        return next()

    console.log({
        name: 'logMiddleware()',
        path: `${request.method} ${request.originalUrl}`,
        body: request.body,
        params: request.params,
        user: request.user
    })
    next()
}

module.exports = logMiddleware
