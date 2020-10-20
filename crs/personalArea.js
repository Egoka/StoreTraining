const {Router} = require('express')
const Product = require('../models/product')
const router = Router()
router.get('/',(req, res) => {
    res.render('personalArea',{
        title: 'Личный кабинет',
        isArea: true
    })
})
router.post('/',async (req, res) => {
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
module.exports = router