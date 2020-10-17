const {Router} = require('express')
const Product = require('../models/product')
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
    const pay = await Pay.remove(req.params.id)
    res.json(pay)
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