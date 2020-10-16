const express = require('express')
const mongoose = require('mongoose')
const URL = require('./password')
const exps = require('express-handlebars')
const path = require('path')
const {routerStart, routerProducts, routerPersonalArea, routerCard} = require('./crs/pages')
const User = require('./models/user')
const app = express()
const hbs = exps.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (req,res,next)=>{
    try{
        req.user = await User.findById('5f8a1bdbb2f5110484d75a53')
        next()
    }catch (err) {
        console.log(err)
    }
})
app.use(express.static(path.join(__dirname,'styles')))
app.use(express.urlencoded({extended:true}))

app.use('/',routerStart)
app.use('/products',routerProducts)
app.use('/personalArea',routerPersonalArea)
app.use('/pay',routerCard)

const PORT = process.env.PORT || 3000
async function start(){
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
start()
