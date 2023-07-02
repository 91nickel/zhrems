const {Schema, model} = require('mongoose')

const schema = new Schema(
    {
        name: {type: String, required: true},
        desc: {type: String},
        image: {type: String},
        user: {type: Schema.Types.ObjectId, ref: 'User'},
        products: {type: Array, required: true},
        weight: {type: Number, required: true},
    },
    {
        timestamps: true,
    }
)

module.exports = model('Meal', schema)