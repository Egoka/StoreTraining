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
module.exports = model('User', user)