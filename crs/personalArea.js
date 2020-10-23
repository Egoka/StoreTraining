const {Router} = require('express')
const {validationResult} = require('express-validator')
const Product = require('../models/product')
const closedPage = require('../middleware/pageAccess')
const {productsValidators} = require('../utils/validators')
const router = Router()
router.get('/', closedPage,(req, res) => {
    res.render('personalArea',{
        title: 'Личный кабинет',
        isArea: true
    })
})
router.post('/', closedPage,productsValidators,async (req, res) => {
    const error = validationResult(req)
    if(!error.isEmpty())
        return res.status(422).render('personalArea',{
            title: 'Личный кабинет',
            isArea: true,
            error: error.array()[0].msg,
            date:{
                title:req.body.title,
                price:req.body.price,
                img: req.body.img
            }
        })
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