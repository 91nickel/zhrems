const {Schema, model} = require('mongoose')

const schema = new Schema(
    {
        name: {type: String, required: true},
        email: {type: String, unique: true, required: true},
        password: {type: String, required: true},
        sex: {type: String, enum: ['male', 'female', 'other']},
        image: String,
        weight: Number,
        role: {type: String, enum: ['user', 'admin']},
    },
    {
        timestamps: true,
    }
)

module.exports = model('User', schema)