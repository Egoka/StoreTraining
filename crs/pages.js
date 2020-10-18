const {Router} = require('express')
const Product = require('../models/product')
const Order = require('../models/order')
const routerStart = Router()
const routerProducts = Router()
const routerPersonalArea = Router()
const routerCard = Router()
const routerOrders = Router()

routerStart.get('/',(req, res) => {
    res.render('index', {
        title: 'Стартовая страница',
        isStart: true
    })
})
/////////////////////////////////////////////////
routerProducts.get('/',async (req, res) => {
    const product = await Product.find().lean()
    res.render('products',{
        title: 'Продукты',
        isProducts: true,
        product
    })
})
routerProducts.get('/:id/edit', async (req, res)=>{
    if(!req.query.allow){
        return res.redirect('/')
    }
    const product = await Product.findById(req.params.id).lean()
    res.render('productEdit',{
        title:`Редактировать ${product.title}`,
        product
    })
})
routerProducts.post('/edit', async (req, res)=>{
    const {id} =req.body
    delete req.body.id
    await Product.findByIdAndUpdate(id, req.body)
    res.redirect('/products')
})
routerProducts.post('/remove', async (req, res)=> {
    try {
        await Product.deleteOne({_id: req.body.id})
        res.redirect('/products')
    } catch (arr) {
        console.log(err)
    }
})
routerProducts.get('/:id', async (req, res)=>{
    const product = await Product.findById(req.params.id).lean()
    res.render('product',{
        layout: 'empty',
        title:`${product.title}`,
        product
    })
})
/////////////////////////////////////////////////
routerPersonalArea.get('/',(req, res) => {
    res.render('personalArea',{
        title: 'Личный кабинет',
        isArea: true
    })
})
routerPersonalArea.post('/',async (req, res) => {
    const product = new Product({
        title:req.body.title,
        price:req.body.price,
        img: req.body.img,
        userId: req.user
    })
    try {
        await product.save()
        res.redirect('/products')
    }catch(arr){
        console.log(err)
    }
})
/////////////////////////////////////////////////
routerCard.post('/add', async (req, res)=>{
    const product = await Product.findById(req.body.id)
    await req.user.addToPay(product)
    res.redirect('/pay')
})
routerCard.delete('/remove/:id', async (req,res)=>{
    await req.user.removeFromCart(req.params.id)
    const user = await req.user
        .populate('basket.items.productId')
        .execPopulate()
    const products = mapPayItems(user.basket)
    const price = sumPrice(products)
    const pay = {products,price}
    res.json(pay)
})
routerCard.get('/', async (req, res)=>{
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
/////////////////////////////////////////////////
routerOrders.get('/',async (req,res)=>{
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
routerOrders.post('/',async (req,res)=> {
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
module.exports = {
    routerStart,
    routerProducts,
    routerPersonalArea,
    routerCard,
    routerOrders}