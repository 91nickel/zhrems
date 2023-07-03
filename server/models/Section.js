const {Schema, model} = require('mongoose')

const schema = new Schema(
    {
        name: {type: String, required: true},
        user: {type: Schema.Types.ObjectId, ref: 'User'},
    },
    {
        timestamps: {createdAt: 'created_at'},
    }
)

module.exports = model('Section', schema)