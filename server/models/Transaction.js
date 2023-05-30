const {Schema, model} = require('mongoose')

const schema = new Schema(
    {
        name: {type: String, required: true},
        desc: {type: String},
        // если указан userId, либо дефолтное если не указан
        user: {type: Schema.Types.ObjectId, ref: 'User'},
        // на 100 г
        proteins: {type: Number, required: true},
        carbohydrates: {type: Number, required: true},
        fats: {type: Number, required: true},
        // в граммах
        weight: {type: Number, required: true},
    },
    {
        timestamps: true,
    }
)


module.exports = model('Transaction', schema)