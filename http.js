const express = require('express')
const mongoose = require('mongoose')
const exps = require('express-handlebars')
const path = require('path')
const csrf = require('csurf')
const flash = require('connect-flash')
const session =require('express-session')
const compression = require('compression')
const MongoSession = require('connect-mongodb-session')(session)
/////////////////////////////////////////////////
const start = require('./crs/start')
const products = require('./crs/products')
const productAddition = require('./crs/productAddition')
const personalArea = require('./crs/personalArea')
const pay = require('./crs/pay')
const orders = require('./crs/orders')
const login = require('./crs/entry')
const varMid = require('./middleware/variables')
const userMid = require('./middleware/userData')
const error404 = require('./middleware/error404')
const fileMiddleware = require('./middleware/fileSaveDB')
const {URL_LOGIN_MONGO_DB:URL,
    KEY_ENCRYPTION:keyEncry
} = require('./keys/password')
/////////////////////////////////////////////////
const app = express()
const hbs = exps.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require('./utils/hbs-helpers')
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
app.use('/saveImage',express.static(path.join(__dirname,'saveImage')))
app.use(express.urlencoded({extended:true}))
//session setup
app.use(session({
    secret:keyEncry,
    resave: false,
    saveUninitialized: false,
    store: storeSession
}))
app.use(fileMiddleware.single('avatar'))
app.use(csrf())
app.use(flash())
app.use(compression())
app.use(varMid)
app.use(userMid)
//paeg announcement
app.use('/',start)
app.use('/products',products)
app.use('/productAddition',productAddition)
app.use('/personalArea',personalArea)
app.use('/pay',pay)
app.use('/orders',orders)
app.use('/entry',login)
app.use(error404)
/////////////////////////////////////////////////
const PORT = process.env.PORT || 3000
async function startProgram(){
    try {
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false})
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    }catch(err){
        console.log(err)}
}
startProgram()
