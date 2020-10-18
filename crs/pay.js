const {Router} = require('express')
const Product = require('../models/product')
const router = Router()
router.post('/add', async (req, res)=>{
    const product = await Product.findById(req.body.id)
    await req.user.addToPay(product)
    res.redirect('/pay')
})
router.delete('/remove/:id', async (req,res)=>{
    await req.user.removeFromCart(req.params.id)
    const user = await req.user
        .populate('basket.items.productId')
        .execPopulate()
    const products = mapPayItems(user.basket)
    const price = sumPrice(products)
    const pay = {products,price}
    res.json(pay)
})
router.get('/', async (req, res)=>{
    const user = await req.user
        .populate('basket.items.productId')
        .execPopulate()
    const pay = mapPayItems(user.basket)
    const price = sumPrice(pay)
    res.render('pay',{
        title: 'Корзина',
        isPay: true,
        products: pay,
        priceProduct: price
    })
})
function mapPayItems(user){
    return user.items.map(prod=>({
        ...prod.productId._doc,
        id: prod.productId.id,
        count:prod.count
    }))}
function sumPrice(pay) {
    return pay.reduce((sum, pay)=>{ return sum += pay.price * pay.count},0)
}
module.exports = router