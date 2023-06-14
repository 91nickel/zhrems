const {Schema, model} = require('mongoose')

const schema = new Schema(
    {
        user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        date: {type: Date, required: true},
        value: {type: Number, required: true},
    },
    {
        timestamps: true,
    }
)

module.exports = model('Weight', schema)