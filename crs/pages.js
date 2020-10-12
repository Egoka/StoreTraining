const {Router} = require('express')
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

module.exports = {routerStart, routerProducts, routerPersonalArea}