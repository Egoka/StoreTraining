const {Schema,model} = require('mongoose')

const user = new Schema({
    email:{
        type: String,
        require: true
    },
    name:{
        type: String,
        require:true
    },
    basket:{
        items:[
            {
                count:{
                    type:Number,
                    require: true,
                    default: 1
                },
                productId:{
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    require: true
                }
            }
        ]
    }
})
user.methods.addToPay = function (product){
    const items = [...this.basket.items]
    const index = items.findIndex(inx=>{
        return inx.productId.toString() === product._id.toString()
    })

    if (index>=0){
        items[index].count += 1
    }else{
        items.push({
            productId: product._id,
            count: 1
        })
    }
    this.basket = {items}
    return this.save()
}
user.methods.removeFromCart = function (id) {
    let items = [...this.basket.items]
    const index = items.findIndex(inx=>{
        return inx.productId.toString() === id.toString()
    })
    if (items[index].count === 1){
        items = items.filter(prod => {
            return prod.productId.toString() !== id.toString()
        })
    }else{
        items[index].count-=1
    }
    this.basket = {items}
    return this.save()
}
user.method('toClient', function (){
    const product = this.toObject()
    product.id = product._id
    delete product._id
    return product
})
user.methods.clearBasket = function () {
    this.basket = {items:[]}
    return this.save()
}
module.exports = model('User', user)