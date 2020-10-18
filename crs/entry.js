const {Router} = require('express')
const router = Router()
router.get('/login',(req, res) => {
    res.render('entry/login', {
        title: 'Авторизация',
        isLogin: true
    })
})
router.post('/login',async (req, res) => {
    res.redirect('/')
})
module.exports = router