const Product = require('../models/Product')
const productMock = require('../mock/product.json')

const initDatabase = async () => {
    console.log('initDatabase')
    const products = await Product.find()
    if (products.length !== productMock.length) {
        await createInitialEntity(Product, productMock)
    }
}

module.exports = initDatabase

async function createInitialEntity (Model, data) {
    console.log('Create initial data')
    await Model.collection.drop()
    return Promise.all(data.map(async item => {
        console.log('Try to create', item)
        try {
            delete item._id
            const newItem = new Model(item)
            await newItem.save()
            return newItem
        } catch (error) {
            return error
        }
    }))
}