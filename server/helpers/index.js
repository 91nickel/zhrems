function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function generateUserData () {
    return {
        name: 'New user',
        sex: 'other',
        image: `https://avatars.dicebear.com/api/avataaars/${(Math.random() + 1)
            .toString(36)
            .substring(7)}.svg`,
    }
}

module.exports = {
    getRandomInt,
    generateUserData,
}