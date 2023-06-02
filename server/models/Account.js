const {Schema, model} = require('mongoose')

const schema = new Schema(
    {
        email: {type: String, unique: true, required: true},
        password: {type: String, required: true},
        admin: {type: Boolean, default: false},
    },
    {
        timestamps: true,
    }
)

module.exports = model('Account', schema)