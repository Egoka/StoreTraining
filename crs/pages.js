const {Router} = require('express')
const Product = require('../models/product')
const Pay = require('../models/pay')
const routerStart = Router()
const routerProducts = Router()
const routerPersonalArea = Router()
const routerCard = Router()

routerStart.get('/',(req, res) => {
    res.render('index', {
        title: 'Стартовая страница',
        isStart: true
    })
})
/////////////////////////////////////////////////
routerProducts.get('/',async (req, res) => {
    const product = await Product.getAll()
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
    const product = await Product.getByID(req.params.id)
    res.render('productEdit',{
        title:`Редактировать ${product.title}`,
        product
    })
})
routerProducts.post('/edit', async (req, res)=>{
    await Product.update(req.body)
    res.redirect('/products')
})
routerProducts.get('/:id', async (req, res)=>{
    const product = await Product.getByID(req.params.id)
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
    const product = new Product(req.body.title, req.body.price, req.body.img)
    await product.save()
    res.redirect('/products')
})
/////////////////////////////////////////////////
routerCard.post('/add', async (req, res)=>{
    const product = await Product.getByID(req.body.id)
    await Pay.add(product)
    res.redirect('/pay')
})
routerCard.get('/', async (req, res)=>{
    const pay = await Pay.fetch()
    res.render('pay',{
        title: 'Корзина',
        isPay: true,
        products: pay.products,
        priceProduct: pay.price
    })
})
/////////////////////////////////////////////////
module.exports = {routerStart, routerProducts, routerPersonalArea, routerCard}