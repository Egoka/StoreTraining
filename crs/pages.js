const {Router} = require('express')
const Product = require('../models/product')
const routerStart = Router()
const routerProducts = Router()
const routerPersonalArea = Router()

routerStart.get('/',(req, res) => {
    res.render('index', {
        title: 'Стартовая страница',
        isStart: true
    })
})
routerProducts.get('/',(req, res) => {
    res.render('products',{
        title: 'Продукты',
        isProducts: true
    })
})
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

module.exports = {routerStart, routerProducts, routerPersonalArea}