const {Schema, model} = require('mongoose')

const schema = new Schema(
    {
        account: {type: Schema.Types.ObjectId, ref: 'Account'},
        name: {type: String, required: true},
        sex: {type: String, enum: ['male', 'female', 'other']},
        image: String,
    },
    {
        timestamps: true,
    }
)

module.exports = model('User', schema)