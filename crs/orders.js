const {Router} = require('express')
const Order = require('../models/order')
const router = Router()
router.get('/',async (req,res)=>{
    try{
        const orders = await Order.find({'user.userId':req.user._id})
            .populate('user.iserId')
        res.render('orders', {
            title: 'Заказы',
            isOrders: true,
            orders: orders.map(prod=>{
                return{
                    ...prod._doc,
                    price: prod.products.reduce((sumPrice, pay)=>{
                        return sumPrice += pay.product.price * pay.count}, 0)
                }
            })
        })
    }catch(err) {
        console.log(err)
    }
})
router.post('/',async (req,res)=> {
    try{
        const user = await req.user
            .populate('basket.items.productId')
            .execPopulate()
        const products = user.basket.items.map(i => ({
            count: i.count,
            product: {...i.productId._doc}
        }))
        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            products: products
        })
        await order.save()
        await req.user.clearBasket()
        res.redirect('/orders')
    }catch(err){
        console.log(err)
    }
})
/////////////////////////////////////////////////
module.exports = router