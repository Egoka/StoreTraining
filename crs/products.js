const {Router} = require('express')
const Product = require('../models/product')
const closedPage = require('../middleware/pageAccess')
const router = Router()
router.get('/',async (req, res) => {
    const product = await Product.find().lean()
    res.render('products',{
        title: 'Продукты',
        isProducts: true,
        product
    })
})
router.get('/:id/edit', closedPage,async (req, res)=>{
    if(!req.query.allow){
        return res.redirect('/')
    }
    const product = await Product.findById(req.params.id).lean()
    res.render('productEdit',{
        title:`Редактировать ${product.title}`,
        product
    })
})
router.post('/edit', closedPage,async (req, res)=>{
    const {id} =req.body
    delete req.body.id
    await Product.findByIdAndUpdate(id, req.body)
    res.redirect('/products')
})
router.post('/remove', closedPage,async (req, res)=> {
    try {
        await Product.deleteOne({_id: req.body.id})
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