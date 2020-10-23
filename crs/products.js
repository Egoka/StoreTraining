const {Router} = require('express')
const {validationResult} = require('express-validator')
const Product = require('../models/product')
const closedPage = require('../middleware/pageAccess')
const {productsValidators} = require('../utils/validators')
const router = Router()
router.get('/',async (req, res) => {
    const product = await Product.find().lean()
    res.render('products',{
        title: 'Продукты',
        isProducts: true,
        userId: req.user ? req.user._id.toString() : null,
        product
    })
})
router.get('/:id/edit', closedPage,async (req, res)=>{
    if(!req.query.allow){
        return res.redirect('/')
    }
    const product = await Product.findById(req.params.id).lean()
    if(product.userId.toString() !== req.user._id.toString())
        res.redirect('/products')
    res.render('productEdit',{
        title:`Редактировать ${product.title}`,
        product
    })
})
router.post('/edit', closedPage,productsValidators,async (req, res)=>{
    const error = validationResult(req)
    const {id} =req.body
    if(!error.isEmpty()){
        const product = await Product.findById(req.params.id).lean()
        return res.render('productEdit',{
            title:`Редактировать продукт`,
            error: error.array()[0].msg,
            product:{
                title:req.body.title,
                price:req.body.price,
                img: req.body.img
            }
        })
    }
    delete req.body.id
    const product = await Product.findById(id).lean()
    if(product.userId.toString() !== req.user._id.toString())
        res.redirect('/products')
    await Product.findByIdAndUpdate(id, req.body)
    res.redirect('/products')
})
router.post('/remove', closedPage,async (req, res)=> {
    try {
        await Product.deleteOne({
            _id: req.body.id,
            userId: req.user._id
        })
        res.redirect('/products')
    } catch (arr) {
        console.log(err)
    }
})
router.get('/:id', async (req, res)=>{
    const product = await Product.findById(req.params.id).lean()
    res.render('product',{
        layout: 'empty',
        title:`${product.title}`,
        product
    })
})

module.exports = router