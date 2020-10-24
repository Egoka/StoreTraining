const {Schema,model} = require('mongoose')

const user = new Schema({
    name:{
        type: String
    },
    email:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require:true
    },
    avatarURL:{
        type: String
    },
    resetToken:{
        type: String
    },
    resetDate:{
        type: Date
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

user.methods.clearBasket = function () {
    this.basket = {items:[]}
    return this.save()
}
module.exports = model('User', user)