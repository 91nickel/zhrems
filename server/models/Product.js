const {Schema, model} = require('mongoose')

const schema = new Schema(
    {
        name: {type: String, required: true},
        desc: {type: String},
        section: {type: Schema.Types.ObjectId, ref: 'Section'},
        // если указан userId, либо дефолтное если не указан
        user: {type: Schema.Types.ObjectId, ref: 'User'},
        // на 100 г
        proteins: {type: Number, required: true},
        carbohydrates: {type: Number, required: true},
        fats: {type: Number, required: true},
        calories: {type: Number, required: true},
        weight: {type: Number, default: 100},
    },
    {
        timestamps: {createdAt: 'created_at'},
    }
)

module.exports = model('Product', schema)