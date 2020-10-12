const express = require('express')
const exps = require('express-handlebars')
const {routerStart, routerProducts, routerPersonalArea} = require('./crs/pages')

const app = express()
const hbs = exps.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static('styles'))
app.use('/',routerStart)
app.use('/products',routerProducts)
app.use('/personalArea',routerPersonalArea)

const PORT = process.env.PORT || 3000

app.listen(3000,()=>{
    console.log(`Server is running on port ${PORT}`)
})