const {Schema, model} = require('mongoose')

const schema = new Schema(
    {
        date: {type: Date, required: true},
        // если указан userId, либо дефолтное если не указан
        user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        products: {type: Array, required: true},
    },
    {
        timestamps: true,
    }
)


module.exports = model('Transaction', schema)