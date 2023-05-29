const {Schema, model} = require('mongoose')

const schema = new Schema(
    {
        userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        value: {type: Number, required: true},
    },
    {
        timestamps: true,
    }
)

module.exports = model('Weight', schema)