const express = require('express')
const mongoose = require('mongoose')
const URL = require('./password')
const exps = require('express-handlebars')
const path = require('path')
const session =require('express-session')
/////////////////////////////////////////////////
const User = require('./models/user')
const start = require('./crs/start')
const products = require('./crs/products')
const personalArea = require('./crs/personalArea')
const pay = require('./crs/pay')
const orders = require('./crs/orders')
const login = require('./crs/entry')
const varMid = require('./middleware/variables')
/////////////////////////////////////////////////
const app = express()
const hbs = exps.create({
    defaultLayout: 'main',
    extname: 'hbs'
})
/////////////////////////////////////////////////
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')
/////////////////////////////////////////////////
app.use(async (req,res,next)=>{
    try{
        req.user = await User.findById('5f8c487ab6096b2384a32a38')
        next()
    }catch (err) {
        console.log(err)
    }
})
app.use(express.static(path.join(__dirname,'styles')))
app.use(express.urlencoded({extended:true}))
//session setup
app.use(session({
    secret:'secret',
    resave: false,
    saveUninitialized: false
}))
app.use(varMid)
//paeg announcement
app.use('/',start)
app.use('/products',products)
app.use('/personalArea',personalArea)
app.use('/pay',pay)
app.use('/orders',orders)
app.use('/entry',login)
/////////////////////////////////////////////////
const PORT = process.env.PORT || 3000
async function startProgram(){
    try {
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false})
        if(!await User.findOne()){
            const user = new User({
                email: 'eg.bonda2014@gmail.com',
                name: 'Egor',
                basket: {items:[]}
            })
            await user.save()
        }
        app.listen(3000, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    }catch(err){
        console.log(err)}
}
startProgram()
