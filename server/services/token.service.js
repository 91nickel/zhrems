const jwt = require('jsonwebtoken')
const config = require('config')
const Token = require('models/Token')

class TokenService {
    generate (payload) {
        const accessToken = jwt.sign(payload, config.get('jwtAccessSecret'), {expiresIn: '1h'})
        const refreshToken = jwt.sign(payload, config.get('jwtRefreshSecret'))
        return {
            idToken: accessToken,
            refreshToken: refreshToken,
            localId: payload.localId,
            isAdmin: payload.isAdmin,
            expiresIn: 3600,
        }
    }

    delete (user) {
        return Token.findOneAndDelete({user})
    }

    async save (account, refreshToken) {
        const data = await Token.findOne({user: account})
        if (data) {
            data.refreshToken = refreshToken
            return await data.save()
        }
        return await Token.create({account, refreshToken})
    }

    async validateAccess (accessToken) {
        try {
            return await jwt.verify(accessToken, config.get('jwtAccessSecret'))
        } catch (error) {
            return null
        }
    }

    async validateRefresh (refreshToken) {
        try {
            return await jwt.verify(refreshToken, config.get('jwtRefreshSecret'))
        } catch (error) {
            return null
        }
    }

    async findToken (refreshToken) {
        try {
            return await Token.findOne({refreshToken})
        } catch (error) {
            return null
        }
    }
}

module.exports = new TokenService()