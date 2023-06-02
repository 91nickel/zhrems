const {Schema, model} = require('mongoose')

const schema = new Schema(
    {
        account: {type: Schema.Types.ObjectId, ref: 'Account', required: true},
        refreshToken: {type: String, required: true},
    },
    {
        timestamps: true,
    }
)

module.exports = model('Token', schema)