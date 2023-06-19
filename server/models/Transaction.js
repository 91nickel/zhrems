const {Schema, model} = require('mongoose')

const schema = new Schema(
    {
        date: {type: Date, required: true},
        desc: String,
        content: Object,
        // если указан userId, либо дефолтное если не указан
        user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        // на 100 г
        proteins: Number,
        carbohydrates: Number,
        fats: Number,
        // в граммах
        weight: {type: Number, required: true},
    },
    {
        timestamps: true,
    }
)


module.exports = model('Transaction', schema)