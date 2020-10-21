const express = require('express')
const mongoose = require('mongoose')
const URL = require('./password')
const exps = require('express-handlebars')
const path = require('path')
const csrf = require('csurf')
const session =require('express-session')
const MongoSession = require('connect-mongodb-session')(session)
/////////////////////////////////////////////////
const User = require('./models/user')
const start = require('./crs/start')
const products = require('./crs/products')
const personalArea = require('./crs/personalArea')
const pay = require('./crs/pay')
const orders = require('./crs/orders')
const login = require('./crs/entry')
const varMid = require('./middleware/variables')
const userMid = require('./middleware/userData')
/////////////////////////////////////////////////
const app = express()
const hbs = exps.create({
    defaultLayout: 'main',
    extname: 'hbs'
})
/////////////////////////////////////////////////
storeSession = new MongoSession({
    collation:'sessions',
    uri: URL
})
/////////////////////////////////////////////////
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')
/////////////////////////////////////////////////
app.use(express.static(path.join(__dirname,'styles')))
app.use(express.urlencoded({extended:true}))
//session setup
app.use(session({
    secret:'secret',
    resave: false,
    saveUninitialized: false,
    store: storeSession
}))
app.use(csrf())
app.use(varMid)
app.use(userMid)
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
        app.listen(3000, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    }catch(err){
        console.log(err)}
}
startProgram()
