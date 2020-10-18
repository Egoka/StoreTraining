const {Schema,model} = require('mongoose')

const product = new Schema({
    title:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    img:{ type: String },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})
product.method('toClient', function (){
    const product = this.toObject()
    product.id = product._id
    delete product._id
    return product
})
module.exports = model('Product', product)