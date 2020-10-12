const express = require('express')
const path = require('path')
const exps = require('express-handlebars')
const app = express()
const hbs = exps.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static('styles'))
app.get('/',(req, res) => {
    res.render('index', {
        title: 'Стартовая страница',
        isStart: true
    })
})
app.get('/products',(req, res) => {
    res.render('products',{
        title: 'Продукты',
        isProducts: true
    })
})
app.get('/personalArea',(req, res) => {
    res.render('personalArea',{
        title: 'Личный кабинет',
        isArea: true
    })
})

const PORT = process.env.PORT || 3000

app.listen(3000,()=>{
    console.log(`Server is running on port ${PORT}`)
})