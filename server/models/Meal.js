const {Schema, model} = require('mongoose')

const schema = new Schema(
    {
        name: {type: String, required: true},
        desc: {type: String},
        image: {type: String},
        user: {type: Schema.Types.ObjectId, ref: 'User'},
        // на 100 г
        proteins: {type: Number, required: true},
        carbohydrates: {type: Number, required: true},
        fats: {type: Number, required: true},
        calories: {type: Number, required: true},
    },
    {
        timestamps: true,
    }
)

module.exports = model('Meal', schema)