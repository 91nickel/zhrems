const {Schema, model} = require('mongoose')

const schema = new Schema(
    {
        date: {type: Date, required: true},
        user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        name: {type: String, required: true},
        product: {type: Schema.Types.ObjectId, ref: 'Product'},
        proteins: {type: Number, required: true},
        carbohydrates: {type: Number, required: true},
        fats: {type: Number, required: true},
        calories: {type: Number, required: true},
        weight: {type: Number, required: true},
    },
    {
        timestamps: true,
    }
)

module.exports = model('Transaction', schema)