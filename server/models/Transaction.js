const {Schema, model} = require('mongoose')

const schema = new Schema(
    {
        name: {type: String, required: true},
        desc: {type: String},
        // ���� ������ userId, ���� ��������� ���� �� ������
        userId: {type: Schema.Types.ObjectId, ref: 'User'},
        // �� 100 �
        proteins: {type: Number, required: true},
        carbohydrates: {type: Number, required: true},
        fats: {type: Number, required: true},
        // � �������
        weight: {type: Number, required: true},
    },
    {
        timestamps: true,
    }
)


module.exports = model('Transaction', schema)